const constanciaRepository = require('../repositories/constanciaRepository');

function formatearFecha(fecha) {
    if (!fecha) return '';
    const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const d = new Date(fecha);
    return `${d.getUTCDate()} de ${meses[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

async function consultarMisConstancias(idUsuario) {
    const constancias = await constanciaRepository.obtenerConstancia(idUsuario);
    return constancias;
}

async function obtenerDatosPdf(idInscripcion) {
    const registro = await constanciaRepository.buscarDatosInscripcion(idInscripcion);
    if (!registro) return null;
    
    const metadata = await constanciaRepository.generarFolioConstancia(idInscripcion);
    
    const temasDb = registro.ID_CURSO 
        ? await constanciaRepository.buscarTemarioCurso(registro.ID_CURSO) 
        : [];
        
    const temario = temasDb.map(t => ({
        tema: t.TITULO_TEMA,
        horas: t.HORAS_DURACION
    }));

    const fechaActual = new Date(metadata.fecha_generacion);
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const anioCompleto = String(fechaActual.getFullYear());
    const anioDosDigitos = String(anioCompleto).slice(-2);

    const folioFormato = `TECNM-163-${String(metadata.folio_numero).padStart(2, '0')}-${mes}-${anioDosDigitos}`;

    const anioCurso = registro.ANIO || anioDosDigitos;
    const periodoCurso = registro.PERIODO || '1';
    const claveFortmato = `D-${anioCurso}-${periodoCurso}-${String(metadata.folio_numero).padStart(2, '0')}`;

    return {
        nombre_completo: registro.NOMBRE_COMPLETO_ALUMNO,
        nombre_curso: registro.NOMBRE_CURSO,
        fecha_inicio: formatearFecha(registro.FECHA_INICIO),
        fecha_fin: formatearFecha(registro.FECHA_TERMINO),
        total_horas: registro.TOTAL_HORAS,
        fecha_emision: formatearFecha(new Date()),
        forma_imparticion: 'Presencial',
        area_adscripcion: 'ACADÉMICA',
        numero_registro: metadata.folio,
        clave_evento: metadata.clave,
        temario
    };
}

module.exports = { consultarMisConstancias, obtenerDatosPdf }; 