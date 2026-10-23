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

async function listarInstructores() {
    return await adminRepository.obtenerInstructores();
}

async function actualizarEstadoInstructor(idInstructor, estado) {
    if(estado === undefined || estado === null || (parseInt(estado) !== 0 && parseInt(estado) !== 1 )) {
        throw new Error("ESTADO_INVALIDO");
    }
    return await adminRepository.cambiarEstadoInstructor(idInstructor, estado);
}

module.exports = { 
    crearInstructor, 
    modificarCurso, 
    removerCurso, 
    listarInstructores, 
    actualizarEstadoInstructor 
};