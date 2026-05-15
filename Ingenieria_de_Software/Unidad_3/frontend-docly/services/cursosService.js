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
    },

    async obtenerAlumnosPorCurso(idCurso) {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${BASE_URL}/api/cursos/alumnos/${idCurso}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Error al obtener alumnos");
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    async registrarHorasAlumno(idInscripcion, horas) {
        try {
            const token = localStorage.getItem("token");
            
            // 1. Asegúrate de que NO haya una diagonal al final de la URL
            const url = `${BASE_URL}/api/cursos/alumnos/horas`; 
            
            console.log("Enviando a:", url);
            console.log("Cuerpo:", { id_inscripcion: Number(idInscripcion), horas_nuevas: Number(horas) });

            const response = await fetch(url, {
                method: "PATCH", // <-- Confirma que el backend espera POST y no PUT
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({
                    id_inscripcion: Number(idInscripcion),
                    horas_completadas: Number(horas) // Cambiado de horas_nuevas a horas_completadas
                })
            });
            const data = await response.json();
            // 2. Si recibes un error, intenta leerlo como texto primero para evitar el error de JSON
            if (!response.ok) {
                throw new Error(data.mensaje || "Error desconocido en el servidor");
            }

            return data;
        } catch (error) {
            console.error("Error en registrarHorasAlumno:", error);
            throw error;
        }
    }
};