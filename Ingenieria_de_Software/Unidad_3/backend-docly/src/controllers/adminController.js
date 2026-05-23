const adminService = require('../services/adminService');

async function registrarInstructor(req, res) {
    try {
        const resultado = await adminService.crearInstructor(req.body);
        console.log(`Instructor ${req.body.nombre} registrado exitosamente.`);
        res.status(201).json({ status: 'Éxito', mensaje: resultado.mensaje });
    } catch (error) {
        if (error.message === "FALTAN_DATOS") {
            return res.status(400).json({ mensaje: 'Todos los campos del instructor son obligatorios.' });
        }
        if (error.message === "DATOS_INCOHERENTES") {
            return res.status(400).json({ mensaje: 'El número de empleado le pertenece a otra persona. Verifica el nombre.' });
        }
        if (error.message === "YA_ES_INSTRUCTOR") {
            return res.status(400).json({ mensaje: 'Este usuario ya está dado de alta como instructor.' });
        }
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar al instructor en el servidor.' });
    }
}

async function actualizarCurso(req, res) {
    try {
        const { idCurso } = req.params;
        const { curso, temas } = req.body;
        const resultado = await adminService.modificarCurso(idCurso, curso, temas);
        console.log(`Curso ID ${idCurso} actualizado exitosamente.`);
        res.status(200).json({ status: 'Éxito', mensaje: resultado.mensaje });
    } catch (error) {
        if (error.message === "FECHAS_INVALIDAS") return res.status(400).json({ mensaje: 'La fecha de término no puede ser anterior a la de inicio.' });
        if (error.message === "NO_EXISTE") return res.status(404).json({ mensaje: 'El curso especificado no existe.' });
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar el curso.' });
    }
}

async function eliminarCurso(req, res) {
    try {
        const { idCurso } = req.params;
        const resultado = await adminService.removerCurso(idCurso);
        console.log(`Curso ID ${idCurso} eliminado exitosamente.`);
        res.status(200).json({ status: 'Éxito', mensaje: resultado.mensaje });
    } catch (error) {
        if (error.message === "CURSO_CON_INSCRITOS") {
            console.log(`Intento de borrar curso ID ${idCurso} denegado (tiene alumnos).`);
            return res.status(400).json({ mensaje: 'No se puede eliminar el curso porque ya tiene alumnos inscritos.' });
        }
        if (error.message === "NO_EXISTE") return res.status(404).json({ mensaje: 'El curso no existe.' });
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar el curso.' });
    }
}

module.exports = { registrarInstructor, actualizarCurso, eliminarCurso };