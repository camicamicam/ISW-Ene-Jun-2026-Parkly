const cursoRepository = require('../repositories/cursoRepository');

async function crearCurso(datosCurso, temas) {
    if (datosCurso.total_horas <= 0 || datosCurso.total_horas > 40) {
        throw new Error("HORAS_INVALIDAS");
    }
    if (datosCurso.cupo_maximo <= 0 || datosCurso.cupo_maximo > 35) {
        throw new Error("CUPO_INVALIDO");
    }
    if (datosCurso.periodo !== 1 && datosCurso.periodo !== 2) {
        throw new Error("PERIODO_INVALIDO");
    }

    let sumaHorasTemas = 0;
    temas.forEach(tema => sumaHorasTemas += tema.horas_duracion);
    
    if (sumaHorasTemas !== datosCurso.total_horas) {
        throw new Error("DESCUADRE_DE_HORAS");
    }

    const idGenerado = await cursoRepository.guardarCurso(datosCurso, temas);

    return { 
        id_curso: idGenerado,
        mensaje: `El curso '${datosCurso.nombre}' y sus ${temas.length} temas fueron registrados con éxito.` 
    };
}

module.exports = { crearCurso };