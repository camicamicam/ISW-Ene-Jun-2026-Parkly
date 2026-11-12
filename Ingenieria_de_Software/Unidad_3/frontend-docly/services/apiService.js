const BASE_URL = "https://api-cursos-itq.onrender.com";

export const apiService = {
    async login(credenciales, tipoPortal) {
        try {

            let endpoint = "/api/v1/auth/loginAdmin";
            let bodyData = {};

            if (tipoPortal === "constancia") {
                // Docentes entran por número de empleado
                endpoint = "/api/v1/auth/loginDoc";
                bodyData = {
                    numero_empleado: credenciales.numeroEmpleado,
                    rol_esperado: "DOCENTE"
                };
            } else {
                // Instructores entran por correo y contraseña
                endpoint = "/api/v1/auth/loginAdmin";
                bodyData = {
                    correo: credenciales.correo,
                    password_acceso: credenciales.password,
                    rol_esperado: tipoPortal === "admin" ? "ADMINISTRADOR" : "INSTRUCTOR"
                };
            }

            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData)
            });

            const data = await response.json();

            // === CAMBIO CLAVE AQUÍ ===
            // Si el login es exitoso y la API nos da un token, lo guardamos
            /*if (response.ok && data.token) {
                localStorage.setItem("token", data.token);
                // Opcional: Guardar el rol para validaciones rápidas en el frontend
                localStorage.setItem("rol", tipoPortal);
            }*/
            
            return data;
        } catch (error) {
            console.error("Error en servicio:", error);
            throw error;
        }
    },

    async getPing() {
        const response = await fetch(`${BASE_URL}/ping`);
        return await response.text();
    },

    // Es buena práctica tener un método para limpiar la sesión
    logout(tipoPortal) {
        // Limpieza específica o total de sesión
        if (tipoPortal) {
            localStorage.removeItem(`token_${tipoPortal}`);
            localStorage.removeItem(`usuario_${tipoPortal}`);
        } else {
            localStorage.clear();
        }
    }
};