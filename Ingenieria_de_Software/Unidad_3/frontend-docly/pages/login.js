// pages/login.js
import { apiService } from "../services/apiService.js";
import { navigate } from "../routes/router.js";
import { Loader } from "../components/loader.js";

export function loginPage() {
    //Configuración de títulos (esto se ejecuta cada vez que se renderiza la página)
    const params = new URLSearchParams(window.location.search);
    const tipoActual = params.get("tipo") || "instructor";

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
            title: "Panel de Administración",
            redirect: "/admin-cursos",
            nota: "Área restringida. Solo personal autorizado de control y diseño curricular."
        }
    };

    const currentConfig = config[tipoActual] || config.instructor;

    //Escuchador de eventos corregido
    if (!window.loginInitialized) {
        const ejecutarLogin = async () => {
                Loader.show();
                // IMPORTANTE: Volvemos a leer el 'tipo' justo en el momento del click
                const urlParams = new URLSearchParams(window.location.search);
                const tipoEnClick = urlParams.get("tipo") || "instructor";
                const pass = document.getElementById("password").value.trim();
                const errorElement = document.getElementById("mensaje-login");

                // Función interna para manejar la interfaz de mensajes
                const mostrarMensaje = (texto, esError = true) => {
                    errorElement.innerText = texto;
                    errorElement.style.display = "block";
                    errorElement.style.color = esError ? "#721c24" : "#155724";
                    errorElement.style.backgroundColor = esError ? "#f8d7da" : "#d4edda";
                    errorElement.style.borderColor = esError ? "#f5c6cb" : "#c3e6cb";
                };

                // Resetear estado
                errorElement.style.display = "none";
                
                try {
                    const data = await apiService.login(pass, tipoEnClick);

                    console.log("=== RESPUESTA LOGIN BACKEND ===", data);

                    if (data.token) {
                        // Guardamos el token en la sesión
                        localStorage.setItem("token", data.token);
                        const userRole = data.rol ? data.rol.toLowerCase() : "";

                        const usuarioParaGuardar = {
                            numero_empleado: data.numero_empleado,
                            nombre: data.nombre,
                            paterno: data.apellido_paterno,
                            materno: data.apellido_materno,
                            correo: data.correo,
                            rol: data.rol
                        };
                        localStorage.setItem("usuario", JSON.stringify(usuarioParaGuardar));

                        // Validación para Instructores
                        if (tipoEnClick === "instructor") {
                            // Si el rol devuelto contiene la palabra 'admin', es el administrador
                            if (userRole.includes("administrador")) {
                                mostrarMensaje("¡Éxito! Bienvenido al Panel de Administrador.", false);
                                navigate("/admin-cursos"); // Nueva ruta para el admin
                                return;
                            }

                            // Si no es admin y tampoco es instructor, entonces sí denegamos el acceso
                            if (userRole !== "instructor") {
                                mostrarMensaje(data.mensaje, true);
                                //alert(data.mensaje);
                                //alert("Acceso denegado: Esta clave no pertenece a un Instructor.");
                                return;
                            }
                            
                            mostrarMensaje(data.mensaje, false);
                            //alert(data.mensaje);
                            //alert("¡Éxito! Bienvenido al Panel de Instructor.");
                            navigate("/instructor");
                        } 
                        // Validación para Constancias (Cualquier rol puede entrar)
                        else if (tipoEnClick === "constancia") {
                            const rolesPermitidos = ["docente", "administrativo"];

                            if (!rolesPermitidos.includes(userRole)) {
                                mostrarMensaje(data.mensaje, true);
                                //alert(data.mensaje);
                                return;
                            }
                            mostrarMensaje(data.mensaje, false);
                            //alert(data.mensaje);
                            //alert("¡Éxito! Cargando sistema de constancias.");
                            navigate("/constancias");
                        }
                    } else {
                        mostrarMensaje(data.mensaje, true);
                    }
                } catch (err) {
                    mostrarMensaje("Error de conexión con el servidor.", true);
                }finally{
                    Loader.hide();
                }
        };

            //Escuchador delegado del evento submit en el formulario
            if (!window.loginInitialized) {
            document.addEventListener("submit", async (e) => {
                if (e.target && e.target.id === "loginForm") {
                    e.preventDefault(); // Previene la recarga automática de la página al dar Enter o submit
                    await ejecutarLogin();
                }
            });
            
            window.loginInitialized = true;
        }
    }

    return `
        <div class="container">
            <form id="loginForm" class="card">
                <h1>${currentConfig.title}</h1>
                <p style="font-size: 13px; color: #666; margin-bottom: 15px; background: #e9ecef; padding: 8px; border-radius: 4px; border-left: 4px solid #34495e;">
                    <strong>Nota:</strong> ${currentConfig.nota}
                </p>
                <input type="password" id="password" placeholder="Ingrese su clave" required>
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