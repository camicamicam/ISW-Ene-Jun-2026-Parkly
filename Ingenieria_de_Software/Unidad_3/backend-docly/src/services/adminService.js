const adminRepository = require('../repositories/adminRepository');

async function crearInstructor(datos) {
    if (!datos.numero_empleado || !datos.nombre || !datos.apellido_paterno || !datos.apellido_materno || !datos.correo || !datos.password_acceso) {
        throw new Error("FALTAN_DATOS");
    }
    return await adminRepository.guardarInstructor(datos);
}

async function modificarCurso(idCurso, curso, temas) {
    const fechaInicio = new Date(curso.fecha_inicio);
    const fechaTermino = new Date(curso.fecha_termino);
    if (fechaTermino < fechaInicio) throw new Error("FECHAS_INVALIDAS");
    return await adminRepository.editarCurso(idCurso, curso, temas);
}

async function removerCurso(idCurso) {
    return await adminRepository.eliminarCurso(idCurso);
}

module.exports = { crearInstructor, modificarCurso, removerCurso };