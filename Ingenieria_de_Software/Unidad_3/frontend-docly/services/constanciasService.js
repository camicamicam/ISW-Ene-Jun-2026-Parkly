// services/constanciasService.js
const { jsPDF } = window.jspdf;

const BASE_URL = "https://api-cursos-itq.onrender.com/api/v1";

export const constanciasService = {
    async obtenerConstanciasDelUsuario() {
        try {
            const token = localStorage.getItem("token");
            console.log("🔑 Token enviado al backend de constancias:", token);

            const response = await fetch(`${BASE_URL}/constancias/mis-constancias`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.mensaje || "Error al recuperar las constancias del servidor");
            }

            const resultado = await response.json();
            console.log("📡 Respuesta cruda del backend en Render:", resultado);
            
            return resultado; 
        } catch (error) {
            console.error("Error en obtenerConstanciasDelUsuario:", error);
            throw error;
        }
    },

    generarPDF(nombreCurso, nombreAlumno) {
        const doc = new jsPDF({ 
            orientation: "landscape", 
            unit: "cm", 
            format: "letter" 
        });

        // --- diseño del PDF---
        doc.setLineWidth(0.08); 
        doc.setDrawColor(20, 52, 100); 
        doc.rect(1, 1, 25.9, 19.6);
        
        doc.setFont("Helvetica", "bold"); 
        doc.setFontSize(36); 
        doc.setTextColor(20, 52, 100);
        doc.text("CONSTANCIA", 13.9, 5, { align: "center" });
        
        doc.setFont("Helvetica", "normal"); 
        doc.setFontSize(16); 
        doc.setTextColor(80, 80, 80);
        doc.text("Se otorga el presente documento a:", 13.9, 8, { align: "center" });
        
        doc.setFont("Helvetica", "bold"); 
        doc.setFontSize(26); 
        doc.setTextColor(0, 0, 0);
        doc.text(nombreAlumno, 13.9, 10.5, { align: "center" });
        
        doc.setLineWidth(0.04); 
        doc.setDrawColor(180, 180, 180); 
        doc.line(5, 11.5, 22.9, 11.5);
        
        doc.setFont("Helvetica", "normal"); 
        doc.setFontSize(15); 
        doc.setTextColor(80, 80, 80);
        doc.text("Por haber concluido satisfactoriamente con el estatus de COMPLETADO el curso:", 13.9, 13.5, { align: "center" });
        
        doc.setFont("Helvetica", "bold"); 
        doc.setFontSize(20); 
        doc.setTextColor(20, 52, 100);
        doc.text(`"${nombreCurso}"`, 13.9, 15.2, { align: "center" });
        
        doc.setFont("Helvetica", "italic"); 
        doc.setFontSize(11); 
        doc.setTextColor(130, 130, 130);
        doc.text("Documento digital verificado mediante el sistema de control curricular.", 13.9, 18.5, { align: "center" });
        // -----------------------------------------------------------------

        //En lugar de doc.save(), generamos un Blob URL
        const blobUrl = doc.output("bloburl");
        
        // Abrimos la pestaña nueva con el visor de PDF nativo del navegador
        window.open(blobUrl, "_blank");
    }
};

window.descargarConstanciaReal = (curso, alumno) => {
    constanciasService.generarPDF(curso, alumno);
};