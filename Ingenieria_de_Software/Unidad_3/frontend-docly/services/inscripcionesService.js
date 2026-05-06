const BASE_URL = "https://api-cursos-itq.onrender.com";

export const inscripcionesService = {
    async inscribir(datos, tipo = "docente") { // Por defecto docente
        try {
            // Construimos la URL dinámicamente según el tipo
            const url = `${BASE_URL}/api/cursos/inscribir/${tipo.toLowerCase()}`;
            
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            const resultado = await response.json();

            if (!response.ok) {
                throw new Error(resultado.message || "Error al procesar la inscripción");
            }

            return resultado;
        } catch (error) {
            console.error(`Error en inscripcionesService (${tipo}):`, error);
            throw error;
        }
    }
};