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
            title: "Acceso Administrador", 
            redirect: "/admin-cursos",
            nota: "En caso de no contar con su contraseña, favor de pasar a <b>DDA</b> para solicitarla."
        }
    };

    const currentConfig = config[tipoActual] || config.instructor;

    // Inicialización única de eventos del formulario
    if (!window.loginInitialized) {
        const ejecutarLogin = async () => {
            Loader.show();
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
                const urlParams = new URLSearchParams(window.location.search);
                const tipoEnClick = urlParams.get("tipo") || "instructor";
                let credenciales = {};

                if (tipoEnClick === "constancia") {
                    const inputNumEmp = document.getElementById("numero_empleado");
                    if (!inputNumEmp) throw new Error("No se encontró el campo de número de empleado.");
                    credenciales.numeroEmpleado = inputNumEmp.value.trim();
                } else {
                    const inputCorreo = document.getElementById("login-correo");
                    const inputPass = document.getElementById("password");
                    if (!inputCorreo || !inputPass) throw new Error("Faltan campos en el formulario.");
                    
                    credenciales.correo = inputCorreo.value.trim();
                    credenciales.password = inputPass.value.trim();
                }

                const data = await apiService.login(credenciales, tipoEnClick);
                console.log("=== RESPUESTA LOGIN BACKEND ===", data);

                if (data && data.token) {
                    const userRole = data.rol ? data.rol.toLowerCase() : "";

                    // Validaciones estrictas por tipo de acceso
                    if (tipoEnClick === "admin" && !userRole.includes("administrador")) {
                        mostrarMensaje("Acceso denegado: Esta cuenta no corresponde a un Administrador.", true);
                        return;
                    }
                    if (tipoEnClick === "instructor" && !userRole.includes("instructor") && !userRole.includes("docente") && !userRole.includes("administrador")) {
                        mostrarMensaje("Acceso denegado: Esta cuenta no pertenece a un Instructor.", true);
                        return;
                    }
                    if (tipoEnClick === "constancia") {
                        const rolesPermitidos = ["docente", "administrativo", "administrador", "instructor"];
                        if (!rolesPermitidos.some(rol => userRole.includes(rol))) {
                            mostrarMensaje("Acceso denegado para este módulo de constancias.", true);
                            return;
                        }
                    }

                    // GUARDADO DE SESIÓN AISLADA Y GLOBAL
                    localStorage.setItem(`token_${tipoEnClick}`, data.token);

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

                    // Respaldo global indispensable para administradores
                    if (userRole.includes("administrador")) {
                        localStorage.setItem("token_admin", data.token);
                        localStorage.setItem("usuario_admin", JSON.stringify(usuarioParaGuardar));
                    }

                    mostrarMensaje("¡Éxito! Redirigiendo...", false);

                    // Redirección inteligente basada en el rol y el tipo de portal
                    setTimeout(() => {
                        if (tipoEnClick === "admin" || userRole.includes("administrador")) {
                            navigate("/admin-cursos");
                        } else if (tipoEnClick === "instructor") {
                            navigate("/instructor");
                        } else if (tipoEnClick === "constancia") {
                            navigate("/constancias");
                        } else {
                            navigate(currentConfig.redirect);
                        }
                    }, 800);

                } else {
                    mostrarMensaje(data.mensaje || "Credenciales incorrectas.", true);
                }
            } catch (err) {
                console.error("🔴 Error en login:", err);
                mostrarMensaje(err.message || "Error de conexión con el servidor.", true);
            } finally {
                Loader.hide();
            }
        };

        // Evento para ver/ocultar contraseña o clave
        document.addEventListener("click", (e) => {
            if (e.target && e.target.id === "toggle-pass") {
                const inputPass = document.getElementById("password") || document.getElementById("numero_empleado");
                if (inputPass) {
                    const esPassword = inputPass.type === "password";
                    inputPass.type = esPassword ? "text" : "password";
                    e.target.classList.toggle("fa-eye", !esPassword);
                    e.target.classList.toggle("fa-eye-slash", esPassword);
                }
            }
        });

        // Evento de envío del formulario
        document.addEventListener("submit", async (e) => {
            if (e.target && e.target.id === "loginForm") {
                e.preventDefault();
                await ejecutarLogin();
            }
        });
            
        window.loginInitialized = true;
    }

    const esModuloDocente = tipoActual === "constancia";

    return `
        <div class="container">
            <form id="loginForm" class="card">
                <h1>${currentConfig.title}</h1>
                <p style="font-size: 13px; color: #666; margin-bottom: 15px; background: #e9ecef; padding: 8px; border-radius: 4px; border-left: 4px solid #34495e;">
                    <strong>Nota:</strong> ${currentConfig.nota}
                </p>

                ${esModuloDocente ? `
                    <div class="input-password" style="display: flex; align-items: center; border: 1px solid #ccc; border-radius: 4px; padding: 0 10px; background: white; margin-bottom: 15px;">
                        <input type="password" id="numero_empleado" placeholder="Ingrese su clave" required>
                        <i id="toggle-pass" class="fa-solid fa-eye" style="cursor: pointer; color: #7f8c8d; font-size: 1.2rem; padding: 0 5px;" title="Ver/Ocultar"></i>
                    </div>
                ` : `
                    <div style="margin-bottom: 15px;">
                        <input type="email" id="login-correo" placeholder="correo@ejemplo.com" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
                    </div>
                    <div class="input-password" style="display: flex; align-items: center; border: 1px solid #ccc; border-radius: 4px; padding: 0 10px; background: white; margin-bottom: 15px;">
                        <input type="password" id="password" placeholder="Ingrese su clave" required>
                        <i id="toggle-pass" class="fa-solid fa-eye" style="cursor: pointer; color: #7f8c8d; font-size: 1.2rem; padding: 0 5px;" title="Ver/Ocultar"></i>
                    </div>
                `}

                <div id="mensaje-login" style="
                    display: none; 
                    padding: 10px; 
                    margin: 15px 0; 
                    border-radius: 5px; 
                    font-size: 14px;
                    text-align: left;
                "></div>
                <button type="submit" id="btnLogin" style="width: 100%; padding: 10px; background: #2c3e50; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Ingresar</button>
            </form>
        </div>
    `;
}