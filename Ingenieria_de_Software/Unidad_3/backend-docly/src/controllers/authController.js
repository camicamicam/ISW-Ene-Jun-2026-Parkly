const authService = require('../services/authService');

async function login(req, res) {
    const { password_acceso } = req.body;

    if (!password_acceso) {
        return res.status(400).json({ mensaje: 'Por favor ingresa tu credencial de acceso.' });
    }

    try {
        // Le pasamos la bronca al Service
        const resultado = await authService.procesarLogin(password_acceso);

        // Si todo sale bien, respondemos
        res.status(200).json({
            status: 'Éxito',
            mensaje: `Bienvenido al sistema, ${resultado.rol.toLowerCase()} ${resultado.nombre}`,
            usuario_id: resultado.id,
            rol: resultado.rol,
            token: resultado.token
        });

    } catch (error) {
        // Manejamos los errores que nos aviente el Service
        if (error.message === "CREDENCIAL_INVALIDA") {
            res.status(401).json({ mensaje: 'Credencial incorrecta, prueba con una diferente.' });
        } else {
            console.error(error);
            res.status(500).json({ mensaje: 'Error interno del servidor (una disculpa).' });
        }
    }
}

module.exports = { login };