const constanciaRepository = require('../repositories/constanciaRepository');

async function consultarMisConstancias(idUsuario) {
    const constancias = await constanciaRepository.obtenerConstancia(idUsuario);
    return constancias;
}

async function obtenerDatosPdf(idInscripcion) {
    const datos = await constanciaRepository.buscarDatosInscripcion(idInscripcion);
    return datos;
}

module.exports = { consultarMisConstancias };