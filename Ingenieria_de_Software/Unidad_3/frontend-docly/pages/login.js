// pages/login.js
import { apiService } from "../services/apiService.js";
import { navigate } from "../routes/router.js";

export function loginPage() {
    // 1. Configuración de títulos (esto se ejecuta cada vez que se renderiza la página)
    const params = new URLSearchParams(window.location.search);
    const tipoActual = params.get("tipo") || "instructor";

    const config = {
        instructor: { title: "Acceso Instructor", redirect: "/instructor" },
        constancia: { title: "Acceso a Constancias", redirect: "/constancias" }
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
                
                try {
                    const data = await apiService.login(pass);

                    if (data.token) {
                        const userRole = data.rol ? data.rol.toLowerCase() : "";

                        // Validación para Instructores
                        if (tipoEnClick === "instructor") {
                            if (userRole !== "instructor") {
                                alert(data.mensaje);
                                //alert("Acceso denegado: Esta clave no pertenece a un Instructor.");
                                return;
                            }
                            alert(data.mensaje);
                            //alert("¡Éxito! Bienvenido al Panel de Instructor.");
                            navigate("/instructor");
                        } 
                        // Validación para Constancias (Cualquier rol puede entrar)
                        else if (tipoEnClick === "constancia") {
                            const rolesPermitidos = ["docente", "administrativo"];

                            if (!rolesPermitidos.includes(userRole)) {
                                alert(data.mensaje);
                                //alert("Acceso denegado: Esta clave no pertenece a constancia.");
                                return;
                            }
                            alert(data.mensaje);
                            //alert("¡Éxito! Cargando sistema de constancias.");
                            navigate("/constancias");
                        }
                    } else {
                        alert(data.mensaje);
                    }
                } catch (err) {
                    alert(data.mensaje);
                    //alert("Error de conexión con el servidor");
                }
            }
        });
        window.loginInitialized = true;
    }

    return `
        <div class="container">
            <div class="card">
                <h1>${currentConfig.title}</h1>
                <input type="password" id="password" placeholder="Ingrese su clave">
                <button id="btnLogin">Ingresar</button>
            </div>
        </div>
    `;
}