const BASE_URL = "https://api-cursos-itq.onrender.com";

export const apiService = {
    async login(password, tipoPortal) {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    password_acceso: password,
                    rol_esperado: tipoPortal
                })
            });

            const data = await response.json();

            // === CAMBIO CLAVE AQUÍ ===
            // Si el login es exitoso y la API nos da un token, lo guardamos
            if (response.ok && data.token) {
                localStorage.setItem("token", data.token);
                // Opcional: Guardar el rol para validaciones rápidas en el frontend
                localStorage.setItem("rol", tipoPortal);
            }
            
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
    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
    }
};