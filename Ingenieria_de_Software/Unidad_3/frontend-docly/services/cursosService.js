const BASE_URL = "https://api-cursos-itq.onrender.com";

export const cursosService = {
    async registrarCurso(cursoData) {
        try {
            const token = localStorage.getItem("token"); 

            const response = await fetch(`${BASE_URL}/api/cursos/registrar`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(cursoData)
            });

            const dataResponse = await response.json();

            if (!response.ok) {
                console.error("Detalle del error del servidor:", dataResponse);
                throw new Error(dataResponse.message || "Error al registrar el curso");
            }

            return dataResponse;
        } catch (error) {
            console.error("Error en cursosService:", error);
            throw error;
        }
    },

    async obtenerCursosDisponibles(tipo) {
        try {
            const token = localStorage.getItem("token");
            
            // Esto asegura que ?tipo=Profesional se codifique bien
            const params = new URLSearchParams({ tipo: tipo });
            const url = `${BASE_URL}/api/cursos/disponibles?${params.toString()}`;
            
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                // Si el backend responde 404 aquí, es que la ruta /api/cursos/disponibles no existe
                throw new Error(`Error ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error("Error en obtenerCursosDisponibles:", error);
            throw error;
        }
    }
};