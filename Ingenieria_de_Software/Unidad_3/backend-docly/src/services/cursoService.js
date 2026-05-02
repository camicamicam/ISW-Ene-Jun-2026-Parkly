const cursoRepository = require("../repositories/cursoRepository");

async function crearCurso(datosCurso, temas) {

    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;

    datosCurso.anio = parseInt(fechaActual.getFullYear().toString().slice(-2));
    datosCurso.periodo = mesActual >= 1 && mesActual <= 6 ? 1 : 2;
    datosCurso.cupo_maximo = 35;
    
    let sumaHorasTemas = 0;
    temas.forEach((tema) => {
        sumaHorasTemas += tema.horas_duracion;
    });

    datosCurso.total_horas = sumaHorasTemas;

    if (datosCurso.total_horas <= 0 || datosCurso.total_horas > 40) {
        throw new Error("HORAS_INVALIDAS");
    }
    if (datosCurso.cupo_maximo <= 0 || datosCurso.cupo_maximo > 35) {
        throw new Error("CUPO_INVALIDO");
    }
    if (datosCurso.periodo !== 1 && datosCurso.periodo !== 2) {
        throw new Error("PERIODO_INVALIDO");
    }

    datosCurso.fecha_inicio_obj = new Date(datosCurso.fecha_inicio);
    datosCurso.fecha_termino_obj = new Date(datosCurso.fecha_termino);

    if(datosCurso.fecha_termino_obj < datosCurso.fecha_inicio_obj) {
        throw new Error("FECHAS_INVALIDAS");
    }

    const idGenerado = await cursoRepository.guardarCurso(datosCurso, temas);

    return {
        id_curso: idGenerado,
        mensaje: `El curso '${datosCurso.nombre}' y sus ${temas.length} temas fueron registrados con éxito.`,
    };
}

async function listarCursos() {
    const filasCrudas = await cursoRepository.obtenerCursos();

    const cursosAgrupados = filasCrudas.reduce((acumulador, filaActual) => {
        const cursoExistente = acumulador.find(c => c.ID_CURSO === filaActual.ID_CURSO);

        if(cursoExistente){
            cursoExistente.TEMAS.push({
                TITULO_TEMA: filaActual.TITULO_TEMA,
                HORAS_TEMA: filaActual.HORAS_TEMA
            });
        } else {
            acumulador.push({
                ID_CURSO: filaActual.ID_CURSO,
                NOMBRE_CURSO: filaActual.NOMBRE_CURSO,
                INSTRUCTOR: filaActual.INSTRUCTOR,
                TOTAL_HORAS: filaActual.TOTAL_HORAS,
                CUPO_MAXIMO: filaActual.CUPO_MAXIMO,
                ANIO: filaActual.ANIO,
                PERIODO: filaActual.PERIODO,
                FECHA_INICIO: filaActual.FECHA_INICIO,
                FECHA_TERMINO: filaActual.FECHA_TERMINO,
                DIAS_SEMANA: filaActual.DIAS_SEMANA,
                HORARIO: filaActual.HORARIO,
                TEMAS: [{
                    TITULO_TEMA: filaActual.TITULO_TEMA,
                    HORAS_TEMA: filaActual.HORAS_TEMA
                }]
            });
        }
        return acumulador;
    }, []);

    return cursosAgrupados;

}

module.exports = { crearCurso, listarCursos };