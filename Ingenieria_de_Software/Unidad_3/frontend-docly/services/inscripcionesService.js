const BASE_URL = "https://api-cursos-itq.onrender.com";

export const inscripcionesService = {
    async obtenerCatalogoPublico(tipo) { // <-- Ahora recibe 'tipo'
        console.log("🔍 Service: Solicitando catálogo para tipo:", tipo);
        try {
            // Construimos la URL con el parámetro de filtro
            const url = tipo 
                ? `${BASE_URL}/api/cursos/catalogo?tipo=${encodeURIComponent(tipo)}` 
                : `${BASE_URL}/api/cursos/catalogo`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const resultado = await response.json();

            if (!response.ok) {
                throw new Error(resultado.message || "Error al obtener el catálogo");
            }

            return resultado; 
        } catch (error) {
            console.error("Error en obtenerCatalogoPublico:", error);
            throw error;
        }
    },

    async inscribir(datos, tipo = "docente") {
        console.log(`Service: Enviando POST a /inscribir/${tipo.toLowerCase()}`); // <--- AGREGAR ESTO
        console.log("Datos del payload:", datos);
        try {
            const url = `${BASE_URL}/api/cursos/inscribir/${tipo.toLowerCase()}`;
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });

            const resultado = await response.json();
            if (!response.ok) {
                throw new Error(resultado.mensaje || "Error al procesar la inscripción");
            }
            return resultado;
        } catch (error) {
            console.warn("⚠️ Error capturado en el service:", error.mensaje);
            throw error;
        }
    }
};