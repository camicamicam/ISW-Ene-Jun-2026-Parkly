const constanciaRepository = require('../repositories/constanciaRepository');

async function consultarMisConstancias(idUsuario) {
    const constancias = await constanciaRepository.obtenerConstancias(idUsuario);
    return constancias;
}

module.exports = { consultarMisConstancias };