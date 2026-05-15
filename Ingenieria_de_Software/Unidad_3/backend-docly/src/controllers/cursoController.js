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

    /*console.log(" ");
    console.log("=== DEBUG DE NOMBRE ===");
    console.log("Instructor a procesar:", nombreFinal);
    console.log("Número de empleado:", curso.instructor_numero_empleado);
    */
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
        switch (error.message) {
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

async function obtenerCursosPorInstructor(req, res) {
    try {
        const idInstructor = req.usuario.id;
        const cursos = await cursoService.listarMisCursos(idInstructor);
        res.status(200).json({
            status: 'Éxito',
            cantidad: cursos.length,
            datos: cursos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener tus cursos en el servidor.' });
    }
}

async function inscribirDocente(req, res) {
    console.log("DATOS RECIBIDOS EN EL POST DOCENTE:", req.body);
    try {
        const resultado = await cursoService.inscripcionDocente(req.body);
        res.status(201).json({ status: 'Éxito', mensaje: resultado.mensaje });
    } catch (error) {
        erroresInscripcion(error, res);
    }
}

async function inscribirAdministrativo(req, res) {
    console.log("DATOS RECIBIDOS EN EL POST ADMINISTRATIVO:", req.body);
    try {
        const resultado = await cursoService.inscripcionAdministrativo(req.body);
        res.status(201).json({ status: 'Éxito', mensaje: resultado.mensaje });
    } catch (error) {
        erroresInscripcion(error, res);
    }
}

function erroresInscripcion(error, res) {
    switch (error.message) {
        case "FALTAN_DATOS":
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios para la inscripción.' });
        case "CUPO_LLENO":
            return res.status(400).json({ mensaje: 'El cupo del curso está lleno.' });
        case "DUPLICADO":
            return res.status(400).json({ mensaje: 'El usuario ya está inscrito en este curso.' });
        case "DEPTO_NO_ACADEMICO":
            return res.status(400).json({ mensaje: 'Los docentes deben pertenecer a un departamento académico válido.' });
        case "NO_EXISTE":
            return res.status(400).json({ mensaje: 'El curso especificado no existe.' });
        case "EMPLEADO_NO_COINCIDE":
            return res.status(400).json({ mensaje: 'El número de empleado ingresado ya está registrado a nombre de otra persona. Verifica tus datos.' });
        default:
            console.error(error);
            return res.status(500).json({ mensaje: 'Error al inscribir al usuario en el servidor.' });
    }
}

async function obtenerAlumnos(req, res) {
    try {
        const { idCurso } = req.params;
        const alumnos = await cursoService.listarAlumnos(idCurso);
        res.status(200).json({
            status: 'Éxito',
            cantidad: alumnos.length,
            datos: alumnos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener los alumnos en el servidor.' });
    }
}

async function actualizarHoras(req, res) {
    try {
        const { id_inscripcion, horas_completadas} = req.body;
        const resultado = await cursoService.registrarProgreso(id_inscripcion, horas_completadas);
        res.status(200).json({ status: 'Éxito', mensaje: resultado.mensaje });
    } catch (error) {
        if (error.message === "HORAS_NEGATIVAS") {
            return res.status(400).json({ mensaje: 'Las horas no pueden ser negativas.' });
        }
        if (error.message === "HORAS_EXCESIVAS") {
            return res.status(400).json({ mensaje: 'Las horas no pueden exceder las 40 horas maximas estandar por curso.' });
        }
        if (error.message === "HORAS_SUPERAN_TOTAL") {
            return res.status(400).json({ mensaje: 'Las horas registradas no pueden superar las horas totales del curso.' });
        }
        if(error.message === "INSCRIPCION_NO_ENCONTRADA") {
            return res.status(404).json({ mensaje: 'No se encontró la inscripción especificada.' });
        }
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar las horas en el servidor.' });
    }
}

module.exports = { registrar, obtenerCursos, obtenerCursosPorInstructor, inscribirDocente, inscribirAdministrativo, erroresInscripcion, obtenerAlumnos, actualizarHoras };