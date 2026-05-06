const cursoService = require('../services/cursoService');

async function registrar(req, res) {
    const { curso, temas } = req.body;

    if (!curso || !curso.nombre || !curso.tipo_curso || !curso.duracion || !temas || temas.length === 0 ||
        !curso.fecha_inicio || !curso.fecha_termino || !curso.dias_semana || !curso.horario ||
        !curso.instructor_numero_empleado || !curso.instructor_nombre || 
        !curso.instructor_paterno || !curso.instructor_correo) {
        return res.status(400).json({ mensaje: 'Faltan datos obligatorios del curso o del instructor.' });
    }

    const nombreFinal = `${curso.instructor_nombre} ${curso.instructor_paterno}`;

    console.log(" ");
    console.log("=== DEBUG DE NOMBRE ===");
    console.log("Instructor a procesar:", nombreFinal);
    console.log("Número de empleado:", curso.instructor_numero_empleado);

    try {
        curso.nombre_instructor_final = nombreFinal;
        const resultado = await cursoService.crearCurso(curso, temas);
        
        res.status(201).json({ 
            status: 'Éxito', 
            mensaje: `Instructor(a) ${nombreFinal}, su curso '${curso.nombre}' fue registrado con éxito.`,
            id_curso: resultado.id_curso
        });

        console.log(`Curso '${curso.nombre}' registrado exitosamente con ID ${resultado.id_curso} por el instructor ${nombreFinal}.`);

    } catch (error) {
        switch(error.message) {
            case "HORAS_INVALIDAS":
                return res.status(400).json({ mensaje: 'Las horas totales deben estar entre 1 y 40.' });
            case "CUPO_INVALIDO":
                return res.status(400).json({ mensaje: 'El cupo debe estar entre 1 y 35 alumnos.' });
            case "PERIODO_INVALIDO":
                return res.status(400).json({ mensaje: 'El periodo solo puede ser 1 o 2.' });
            case "DESCUADRE_DE_HORAS":
                return res.status(400).json({ mensaje: 'La suma de horas del temario no coincide con las horas totales del curso.' });
            case "FECHAS_INVALIDAS":
                return res.status(400).json({ mensaje: 'La fecha de término no puede ser anterior a la fecha de inicio.' });
            default:
                console.error(error);
                return res.status(500).json({ mensaje: 'Error al registrar el curso en el servidor.' });
        }
    }
}

async function obtenerCursos(req, res) {
    try {
        const tipoFiltro = req.query.tipo;
        const cursos = await cursoService.listarCursos(tipoFiltro);
        res.status(200).json({ 
            status: 'Éxito', 
            cantidad: cursos.length,
            datos: cursos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener los cursos en el servidor.' });
    }
}

module.exports = { registrar, obtenerCursos };