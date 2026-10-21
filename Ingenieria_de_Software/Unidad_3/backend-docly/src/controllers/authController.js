const authService = require('../services/authService');

async function login(req, res/*, rol_esperado */) {
    const { password_acceso, rol_esperado } = req.body;

    if (!password_acceso) {
        return res.status(400).json({ mensaje: 'Por favor ingresa tu credencial de acceso.' });
    }

    if (!rol_esperado) {
        return res.status(400).json({ mensaje: 'Rol vacio, prueba de nuevo.' });
    }

    try {
        const resultado = await authService.procesarLogin(password_acceso, rol_esperado);
        //console.log(`Usuario ${resultado.nombre} autenticado exitosamente con rol ${resultado.rol}.`);
        res.status(200).json({
            status: 'Éxito',
            token: resultado.token,
            mensaje: `Bienvenido al sistema, ${resultado.rol.toLowerCase()} ${resultado.nombre_usuario}`,
            datosUsuario: {
                usuario_id: resultado.id,
                rol: resultado.rol,
                numero_empleado: resultado.numero_empleado,
                correo: resultado.correo,
                nombre: resultado.nombre_usuario,
                apellido_paterno: resultado.apellido_p_usuario,
                apellido_materno: resultado.apellido_m_usuario || ""
            }
        });

    } catch (error) {
        if (error.message === "CREDENCIAL_INVALIDA") {
            res.status(401).json({ mensaje: 'Credencial incorrecta, revisa si esta bien o acude a DDA.' });
        } else if (error.message === "ROL_INCORRECTO") {
            res.status(403).json({ mensaje: 'Acceso denegado, credenciales erroneas.' });
        }else {
            console.error(error);
            res.status(500).json({ mensaje: 'Error interno del servidor.' });
        }
    }
}

module.exports = { login };