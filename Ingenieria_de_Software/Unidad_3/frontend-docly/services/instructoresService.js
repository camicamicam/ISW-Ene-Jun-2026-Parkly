const BASE_URL = "https://api-cursos-itq.onrender.com/api/v1";

export const instructoresService = {
    async registrarInstructor(datosInstructor) {
        try {
            const token = localStorage.getItem("token_admin"); 

            // Esto formará exactamente: https://api-cursos-itq.onrender.com/api/v1/admin/instructores/registrar
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
    },

    async listarInstructores() {
        try {
            const token = localStorage.getItem("token_admin");
            console.log("🔍 Token recuperado para listar instructores:", token);
            const respuesta = await fetch(`${BASE_URL}/admin/instructores/obtener`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!respuesta.ok) {
                const errorData = await respuesta.json().catch(() => ({}));
                throw new Error(errorData.mensaje || "Error al obtener la lista de instructores.");
            }

            return await respuesta.json();
        } catch (err) {
            console.error("Error en listarInstructores:", err);
            throw err;
        }
    },

    async actualizarEstadoInstructor(idInstructor, nuevoEstado) {
        try {
            const token = localStorage.getItem("token_admin");
            const respuesta = await fetch(`${BASE_URL}/admin/instructores/${idInstructor}/estado`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });

            if (!respuesta.ok) {
                const errorData = await respuesta.json().catch(() => ({}));
                throw new Error(errorData.mensaje || "Error al actualizar el estado del instructor.");
            }

            return await respuesta.json();
        } catch (err) {
            console.error("Error en actualizarEstadoInstructor:", err);
            throw err;
        }
    }
};