const BASE_URL = "https://api-cursos-itq.onrender.com/api/v1";
export const instructoresService = {
    async registrarInstructor(datosInstructor) {
        try {
            const token = localStorage.getItem("token"); 

            const respuesta = await fetch(`${BASE_URL}/admin/instructores/registrar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(datosInstructor)
            });

            if (!respuesta.ok) {
                const errorData = await respuesta.json().catch(() => ({}));
                throw new Error(errorData.mensaje || "Error al registrar el instructor.");
            }

            return await respuesta.json();
        } catch (err) {
            console.error("Error en registrarInstructor:", err);
            throw err;
        }
    }
};