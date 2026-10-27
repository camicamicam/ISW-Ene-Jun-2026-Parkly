// pages/login.js
import { apiService } from "../services/apiService.js";
import { navigate } from "../routes/router.js";
import { Loader } from "../components/loader.js";

export function loginPage() {
    const params = new URLSearchParams(window.location.search);
    const tipoActual = params.get("tipo") || "instructor"; // instructor, constancia o admin

    const tokenAdminGlobal = localStorage.getItem("token_admin");
    const usuarioAdminGlobal = localStorage.getItem("usuario_admin");

    if (tokenAdminGlobal && usuarioAdminGlobal) {
        try {
            const usuarioAdmin = JSON.parse(usuarioAdminGlobal);
            const rolAdmin = usuarioAdmin.rol ? usuarioAdmin.rol.toLowerCase() : "";
            if (rolAdmin.includes("administrador")) {
                setTimeout(() => navigate("/admin-cursos"), 0);
                return `<div class="container"><p style="text-align:center; padding:50px;">Redirigiendo al panel de administración...</p></div>`;
            }
        } catch (e) {
            localStorage.removeItem("token_admin");
            localStorage.removeItem("usuario_admin");
        }
    }

    // 1. MANEJO DE SESIÓN AISLADA SEGÚN EL MÓDULO ACTUAL
    const tokenModulo = localStorage.getItem(`token_${tipoActual}`);
    const usuarioModulo = localStorage.getItem(`usuario_${tipoActual}`);

    if (tokenModulo && usuarioModulo) {
        try {
            const usuario = JSON.parse(usuarioModulo);
            const userRole = usuario.rol ? usuario.rol.toLowerCase() : "";

            const esAdmin = userRole.includes("administrador");
            const esInstructor = userRole.includes("instructor") || userRole.includes("docente");

            // Redirección automática si ya hay sesión válida en ESTE módulo
            if (tipoActual === "admin" && esAdmin) {
                setTimeout(() => navigate("/admin-cursos"), 0);
                return `<div class="container"><p style="text-align:center; padding:50px;">Redirigiendo al panel de administración...</p></div>`;
            }
            if (tipoActual === "instructor" && esInstructor) {
                setTimeout(() => navigate("/instructor"), 0);
                return `<div class="container"><p style="text-align:center; padding:50px;">Redirigiendo al panel de instructor...</p></div>`;
            }
            if (tipoActual === "constancia" && (esInstructor || esAdmin || userRole.includes("administrativo") || userRole.includes("docente"))) {
                setTimeout(() => navigate("/constancias"), 0);
                return `<div class="container"><p style="text-align:center; padding:50px;">Redirigiendo al módulo de constancias...</p></div>`;
            }
        } catch (e) {
            localStorage.removeItem(`token_${tipoActual}`);
            localStorage.removeItem(`usuario_${tipoActual}`);
        }
    }

    const config = {
        instructor: { 
            title: "Acceso Instructor", 
            redirect: "/instructor",
            nota: "En caso de no contar con su contraseña, favor de pasar a <b>DDA</b> para solicitarla."
        },
        constancia: { 
            title: "Acceso a Constancias", 
            redirect: "/constancias",
            nota: "La clave fue proporcionada en su correo de confirmación." 
        },
        admin: {
            title: "Acceso Instructor", 
            redirect: "/admin-cursos",
            nota: "En caso de no contar con su contraseña, favor de pasar a <b>DDA</b> para solicitarla."
        }
    };

    const currentConfig = config[tipoActual] || config.instructor;

    // Inicialización única de eventos del formulario
    if (!window.loginInitialized) {
        const ejecutarLogin = async () => {
            Loader.show();
            const urlParams = new URLSearchParams(window.location.search);
            const tipoEnClick = urlParams.get("tipo") || "instructor";
            const pass = document.getElementById("password").value.trim();
            const errorElement = document.getElementById("mensaje-login");

            const mostrarMensaje = (texto, esError = true) => {
                errorElement.innerText = texto;
                errorElement.style.display = "block";
                errorElement.style.color = esError ? "#721c24" : "#155724";
                errorElement.style.backgroundColor = esError ? "#f8d7da" : "#d4edda";
                errorElement.style.borderColor = esError ? "#f5c6cb" : "#c3e6cb";
            };

            errorElement.style.display = "none";
            
            try {
                const data = await apiService.login(pass, tipoEnClick);

                console.log("=== RESPUESTA LOGIN BACKEND ===", data);

                if (data.token) {
                    const userRole = data.rol ? data.rol.toLowerCase() : "";

                    if (userRole.includes("administrador")) {
                        localStorage.setItem("token_admin", data.token);
                        localStorage.setItem("usuario_admin", JSON.stringify({
                            numero_empleado: data.numero_empleado,
                            nombre: data.nombre,
                            paterno: data.apellido_paterno,
                            materno: data.apellido_materno,
                            correo: data.correo,
                            rol: data.rol,
                            tipoAcceso: "admin"
                        }));
                    }

                    // Validaciones estrictas por tipo de acceso antes de guardar
                    if (tipoEnClick === "admin" && !userRole.includes("administrador")) {
                        mostrarMensaje("Acceso denegado: Esta clave no corresponde a un Administrador.", true);
                        return;
                    }
                    if (tipoEnClick === "instructor" && !userRole.includes("instructor") && !userRole.includes("docente") && !userRole.includes("administrador")) {
                        mostrarMensaje("Acceso denegado: Esta clave no pertenece a un Instructor.", true);
                        return;
                    }
                    if (tipoEnClick === "constancia") {
                        const rolesPermitidos = ["docente", "administrativo"];
                        if (!rolesPermitidos.some(rol => userRole.includes(rol))) {
                            mostrarMensaje("Acceso denegado para este módulo de constancias.", true);
                            return;
                        }
                    }

                    // GUARDADO 100% AISLADO (Ya no pisa los demás módulos)
                    localStorage.setItem(`token_${tipoEnClick}`, data.token);
                    localStorage.setItem("token_admin", data.token); // Respaldo global permanente para el admin

                    const usuarioParaGuardar = {
                        numero_empleado: data.numero_empleado,
                        nombre: data.nombre,
                        paterno: data.apellido_paterno,
                        materno: data.apellido_materno,
                        correo: data.correo,
                        rol: data.rol,
                        tipoAcceso: tipoEnClick
                    };
                    localStorage.setItem(`usuario_${tipoEnClick}`, JSON.stringify(usuarioParaGuardar));
                    localStorage.setItem("usuario_admin", JSON.stringify(usuarioParaGuardar)); // Respaldo global de usuario admin

                    mostrarMensaje("¡Éxito! Redirigiendo...", false);

                    // Redirección final al panel correspondiente
                    if (tipoEnClick === "admin" || userRole.includes("administrador")) {
                        navigate("/admin-cursos");
                    } else if (tipoEnClick === "instructor") {
                        navigate("/instructor");
                    } else if (tipoEnClick === "constancia") {
                        navigate("/constancias");
                    } else {
                        navigate(currentConfig.redirect);
                    }

                } else {
                    mostrarMensaje(data.mensaje || "Credenciales incorrectas.", true);
                }
            } catch (err) {
                mostrarMensaje("Error de conexión con el servidor.", true);
            } finally {
                Loader.hide();
            }
        };

        // Evento para ver/ocultar contraseña
        document.addEventListener("click", (e) => {
            if (e.target && e.target.id === "toggle-pass") {
                const inputPass = document.getElementById("password");
                if (inputPass) {
                    const esPassword = inputPass.type === "password";
                    inputPass.type = esPassword ? "text" : "password";
                    e.target.classList.toggle("fa-eye", !esPassword);
                    e.target.classList.toggle("fa-eye-slash", esPassword);
                }
            }
        });

        // Evento de envío del formulario de login
        document.addEventListener("submit", async (e) => {
            if (e.target && e.target.id === "loginForm") {
                e.preventDefault();
                await ejecutarLogin();
            }
        });
            
        window.loginInitialized = true;
    }

    return `
        <div class="container">
            <form id="loginForm" class="card">
                <h1>${currentConfig.title}</h1>
                <p style="font-size: 13px; color: #666; margin-bottom: 15px; background: #e9ecef; padding: 8px; border-radius: 4px; border-left: 4px solid #34495e;">
                    <strong>Nota:</strong> ${currentConfig.nota}
                </p>
                <div class="input-password">
                    <input type="password" id="password" placeholder="Ingrese su clave" required>
                    <i id="toggle-pass" class="fa-solid fa-eye" style="cursor: pointer; color: #7f8c8d; font-size: 1.2rem; padding: 0 5px;" title="Ver/Ocultar contraseña"></i>
                </div>
                <div id="mensaje-login" style="
                    display: none; 
                    padding: 10px; 
                    margin: 15px 0; 
                    border-radius: 5px; 
                    font-size: 14px;
                    text-align: left;
                "></div>
                <button type="submit" id="btnLogin">Ingresar</button>
            </form>
        </div>
    `;
}