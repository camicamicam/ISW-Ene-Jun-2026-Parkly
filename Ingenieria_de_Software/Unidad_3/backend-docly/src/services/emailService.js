require('dotenv').config();

function esc(texto) {
    return String(texto ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}

async function enviarConfirmacionInscripcion({ correo, nombre, numero_empleado, curso }) {
    const temario = (curso.TEMAS || [])
        .filter(t => t.TITULO_TEMA)
        .map(t => `<li>${esc(t.TITULO_TEMA)} (${esc(t.HORAS_TEMA)} h)</li>`)
        .join('');

    const html = `
        <h2>Confirmación de inscripción</h2>
        <p>Hola ${esc(nombre)}, tu inscripción al siguiente curso se registró correctamente.</p>

        <h3>Datos del curso</h3>
        <ul>
            <li><strong>Curso:</strong> ${esc(curso.NOMBRE_CURSO)}</li>
            <li><strong>Tipo:</strong> ${esc(curso.TIPO_CURSO)}</li>
            <li><strong>Instructor:</strong> ${esc((curso.INSTRUCTOR || '').trim())}</li>
            <li><strong>Fechas:</strong> del ${formatearFecha(curso.FECHA_INICIO)} al ${formatearFecha(curso.FECHA_TERMINO)}</li>
            <li><strong>Días:</strong> ${esc(curso.DIAS_SEMANA)}</li>
            <li><strong>Horario:</strong> ${esc(curso.HORARIO)}</li>
            <li><strong>Horas totales:</strong> ${esc(curso.TOTAL_HORAS)}</li>
            <li><strong>Lugar:</strong> Instituto Tecnológico de Querétaro</li>
        </ul>

        ${temario ? `<h3>Temario</h3><ul>${temario}</ul>` : ''}

        <h3>Acceso a constancias</h3>
        <p>Para consultar sus constancias, ingrese al portal de constancias con su número de empleado.</p>
    `;

    const respuesta = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: process.env.RESEND_FROM,
            to: [correo],
            subject: `Confirmación de inscripción: ${curso.NOMBRE_CURSO}`,
            html
        })
    });

    if (!respuesta.ok) {
        throw new Error(`Resend respondió ${respuesta.status}: ${await respuesta.text()}`);
    }
}

module.exports = { enviarConfirmacionInscripcion };