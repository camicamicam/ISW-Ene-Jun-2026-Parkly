// login.js
import { apiService } from "../services/apiService.js";
import { navigate } from "../routes/router.js";

export function loginPage() {
    // Escuchador de eventos delegado (para que funcione aunque el HTML se borre y recree)
    if (!window.loginInitialized) {
        document.addEventListener("click", async (e) => {
            if (e.target && e.target.id === "btnLogin") {
                const pass = document.getElementById("password").value;
                try {
                    const data = await apiService.login(pass); // Uso correcto de apiService
                    if (data.token) {
                        alert("¡Éxito!");
                        navigate("/instructor");
                    } else {
                        alert(data.mensaje || "Error en login");
                    }
                } catch (err) {
                    alert("Error de conexión");
                }
            }
        });
        window.loginInitialized = true;
    }

    return `
        <div class="container">
            <div class="card">
                <h1>Login</h1>
                <input type="password" id="password" placeholder="Clave">
                <button id="btnLogin">Ingresar</button>
            </div>
        </div>
    `;
}