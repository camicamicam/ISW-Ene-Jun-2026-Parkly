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
    }
};