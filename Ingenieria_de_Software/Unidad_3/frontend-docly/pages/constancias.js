// pages/constancias.js
import { constanciasService } from '../services/constanciasService.js';

export const constanciasPage = async () => {
    
    setTimeout(async () => {
        const contenedor = document.getElementById('contenedor-dinamico-constancias');
        if (!contenedor) return;

        try {
            // 1. Llamamos al servicio real (Fetch hacia Render)
            const respuestaBackend = await constanciasService.obtenerConstanciasDelUsuario();

            // 2. CORRECCIÓN: Extraemos el array usando la clave exacta del log ('datos')
            const lista = Array.isArray(respuestaBackend) 
                ? respuestaBackend 
                : (respuestaBackend.datos || respuestaBackend.data || []);

            // ESCENARIO A: El array viene vacío (No hay cursos con el 100% de las horas)
            if (lista.length === 0) {
                contenedor.innerHTML = `
                    <div style="border: 1px solid #ffcc00; background-color: #fff9e6; padding: 30px; border-radius: 8px; text-align: center; max-width: 600px; margin: 40px auto;">
                        <h3 style="color: #b38600; margin: 0 0 10px 0; font-size: 20px;">Aún no cuenta con cursos completados</h3>
                        <p style="margin: 0; color: #665200; font-size: 15px; line-height: 1.5;">
                            El sistema refleja que los cursos inscritos no han alcanzado el 100% de las horas requeridas. 
                            Una vez completadas por su instructor, podrá descargar su reconocimiento desde aquí.
                        </p>
                    </div>
                `;
                return;
            }

            // ESCENARIO B: El usuario sí tiene constancias listas
            let htmlGrid = `
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; margin-top: 25px;">
            `;

            lista.forEach(item => {
                // Mapeamos las propiedades idénticas a la respuesta de la base de datos de Oracle
                const nombreCurso = item.NOMBRE_CURSO || "Curso de Capacitación";
                const nombreAlumno = item.NOMBRE_COMPLETO_ALUMNO || item.NOMBRE_COMPLETO || "Participante";
                const estatus = "COMPLETADO"; // Forzado a completado ya que el backend solo lo envía si cumplió las horas

                // Limpiamos comillas para evitar errores sintácticos en el onclick de HTML
                const cursoLimpio = nombreCurso.replace(/'/g, "\\'");
                const alumnoLimpio = nombreAlumno.replace(/'/g, "\\'");

                htmlGrid += `
                    <div style="border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px; background: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <span style="background: #e6f4ea; color: #137333; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 12px;">
                                ${estatus}
                            </span>
                            <h3 style="margin: 0 0 8px 0; color: #143464; font-size: 18px; line-height: 1.4;">${nombreCurso}</h3>
                            <p style="margin: 0 0 20px 0; font-size: 14px; color: #4a5568;"><strong>Beneficiario:</strong> ${nombreAlumno}</p>
                        </div>
                        <button 
                            onclick="window.descargarConstanciaReal('${cursoLimpio}', '${alumnoLimpio}')"
                            style="background: #143464; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; width: 100%; font-weight: bold; font-size: 14px; transition: background 0.2s;"
                            onmouseover="this.style.background='#1d4ed8'"
                            onmouseout="this.style.background='#143464'"
                        >
                            Generar Constancia
                        </button>
                    </div>
                `;
            });

            htmlGrid += `</div>`;
            contenedor.innerHTML = htmlGrid;

        } catch (error) {
            console.error(error);
            contenedor.innerHTML = `
                <div style="text-align: center; margin-top: 40px;">
                    <p style="color: #dc2626; font-weight: bold; margin-bottom: 5px;">Error al conectar con el almacén de constancias.</p>
                    <p style="color: #666; font-size: 14px;">${error.message || "Por favor, intente de nuevo más tarde."}</p>
                </div>
            `;
        }
    }, 0);

    return `
        <div style="max-width: 1000px; margin: 0 auto; padding: 30px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 20px;">
                <h1 style="color: #143464; margin: 0 0 5px 0; font-size: 28px;">Mis Constancias</h1>
                <p style="color: #718096; margin: 0; font-size: 15px;">Aquí encontrará las constancias de los cursos que ha acreditado en su totalidad.</p>
            </div>
            
            <div id="contenedor-dinamico-constancias">
                <p style="color: #4a5568; font-size: 16px; text-align: center; margin-top: 40px;">
                    Cargando constancias expedidos desde el servidor...
                </p>
            </div>
        </div>
    `;
};