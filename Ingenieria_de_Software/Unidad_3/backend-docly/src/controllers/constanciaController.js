const constanciaService = require('../services/constanciaService');

async function obtenerConstanciasDisponibles(req, res) {
    try {
        const idUsuario = req.usuario.id;
        
        const constancias = await constanciaService.consultarMisConstancias(idUsuario);

        res.status(200).json({
            status: 'Éxito',
            datos: constancias
        });

    } catch (error) {
        console.error("Error al consultar constancias:", error);
        res.status(500).json({ mensaje: 'Error interno al consultar las constancias.' });
    }
}

module.exports = { obtenerConstanciasDisponibles };