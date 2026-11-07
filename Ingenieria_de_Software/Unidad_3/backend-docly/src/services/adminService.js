const adminRepository = require('../repositories/adminRepository');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const CARACTERES = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

function generarPasswordAleatoria(longitud = 12) {
    let password = "";
    for (let i = 0; i < longitud; i++) {
        password += CARACTERES[crypto.randomInt(CARACTERES.length)];
    }
    return password;
}

async function crearInstructor(datos) {
    if (!datos.numero_empleado || !datos.nombre || !datos.apellido_paterno || !datos.apellido_materno || !datos.correo) {
        throw new Error("FALTAN_DATOS");
    }
    const password = generarPasswordAleatoria(12);
    const passwordHash = await bcrypt.hash(password, 10);
    datos.password_acceso = passwordHash;
    const resultado = await adminRepository.guardarInstructor(datos);
    return { ...resultado, password_generada: password };
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
    /*
    const instructores = await adminRepository.obtenerInstructores();
    return instructores.map(instructor => {
        const { password_acceso, ...datosSeguros } = instructor;
        return datosSeguros;
    });
    */
}

async function actualizarEstadoInstructor(idInstructor, estado) {
    if(estado === undefined || estado === null || (parseInt(estado) !== 0 && parseInt(estado) !== 1 )) {
        throw new Error("ESTADO_INVALIDO");
    }
    return await adminRepository.cambiarEstadoInstructor(idInstructor, estado);
}

async function editarInstructor(idInstructor, datos) {
    if (!datos.numero_empleado || !datos.nombre || !datos.apellido_paterno || !datos.apellido_materno || !datos.correo || datos.nivel_acceso === undefined || datos.nivel_acceso === null) {
        throw new Error("FALTAN_DATOS");
    }
    let nuevaPasswordPlana = null;
    if (datos.regenerar_password === true) {
        nuevaPasswordPlana = generarPasswordAleatoria(12);
        const nuevaPasswordHash = await bcrypt.hash(nuevaPasswordPlana, 10);
        datos.password_acceso = nuevaPasswordHash;
    }
    const resultado = await adminRepository.editarInstructor(idInstructor, datos);
    if (nuevaPasswordPlana) {
        resultado.password_generada = nuevaPasswordPlana;
    }
    return resultado;
}

module.exports = { 
    crearInstructor, 
    modificarCurso, 
    removerCurso, 
    listarInstructores, 
    actualizarEstadoInstructor,
    editarInstructor,
    generarPasswordAleatoria
};