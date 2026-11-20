const constanciaService = require('../services/constanciaService');
const { generarConstancia } = require('../utils/constaciaTemplate');

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

async function descargarConstancia(req, res) {
    try {
        const { idInscripcion } = req.params;
        const datosConstancia = await constanciaService.obtenerDatosPdf(idInscripcion);

        if (!datosConstancia) {
            return res.status(404).json({ mensaje: 'Constancia no encontrada.' });
        }

        await generarConstancia(datosConstancia, res);
        
    } catch (error) {
        if (error.message === 'REQUISITOS_INCOMPLETOS') {
            return res.status(400).json({ mensaje: 'No se pueden generar constancias sin cumplir con los requisitos.' });
        }
        console.error("Error al descargar constancia:", error);
        if (!res.headersSent) {
            res.status(500).json({ mensaje: 'Error interno al descargar la constancia.' });
        }
    }
}

module.exports = { obtenerConstanciasDisponibles, descargarConstancia };