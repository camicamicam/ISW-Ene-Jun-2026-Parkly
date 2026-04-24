// pages/login.js
import { apiService } from "../services/apiService.js";
import { navigate } from "../routes/router.js";

export function loginPage() {
    // 1. Configuración de títulos (esto se ejecuta cada vez que se renderiza la página)
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
        }
    };

    const currentConfig = config[tipoActual] || config.instructor;

    // 2. Escuchador de eventos corregido
    if (!window.loginInitialized) {
        document.addEventListener("click", async (e) => {
            if (e.target && e.target.id === "btnLogin") {
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
                    const data = await apiService.login(pass);

                    if (data.token) {
                        const userRole = data.rol ? data.rol.toLowerCase() : "";

                        // Validación para Instructores
                        if (tipoEnClick === "instructor") {
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
                }
            }
        });
        window.loginInitialized = true;
    }

    return `
        <div class="container">
            <div class="card">
                <h1>${currentConfig.title}</h1>
                <p style="font-size: 13px; color: #666; margin-bottom: 15px; background: #e9ecef; padding: 8px; border-radius: 4px; border-left: 4px solid #34495e;">
                    <strong>Nota:</strong> ${currentConfig.nota}
                </p>
                <input type="password" id="password" placeholder="Ingrese su clave">
                <div id="mensaje-login" style="
                    display: none; 
                    padding: 10px; 
                    margin: 15px 0; 
                    border-radius: 5px; 
                    font-size: 14px;
                    text-align: left;
                "></div>
                <button id="btnLogin">Ingresar</button>
            </div>
        </div>
    `;
}