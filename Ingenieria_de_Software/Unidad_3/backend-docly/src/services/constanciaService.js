const constanciaRepository = require('../repositories/constanciaRepository');

async function consultarMisConstancias(idUsuario) {
    const constancias = await constanciaRepository.obtenerConstancia(idUsuario);
    return constancias;
}

module.exports = { consultarMisConstancias };