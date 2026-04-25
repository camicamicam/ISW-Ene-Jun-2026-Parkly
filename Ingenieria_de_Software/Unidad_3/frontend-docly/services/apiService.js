const BASE_URL = "https://api-cursos-itq.onrender.com"; // Variable por si cambia

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
            return await response.json();
        } catch (error) {
            console.error("Error en servicio:", error);
            throw error;
        }
    },

    async getPing() {
        const response = await fetch(`${BASE_URL}/ping`);
        return await response.text();
    }
};