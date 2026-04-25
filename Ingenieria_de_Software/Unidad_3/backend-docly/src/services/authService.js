const authRepository = require('../repositories/authRepository');
const jwt = require('jsonwebtoken');

async function procesarLogin(password_acceso, rol_esperado) {
    // 1. Pedirle al repo que busque
    const rows = await authRepository.verificarCredenciales(password_acceso);

    // 2. Lógica de negocio: ¿Existe?
    if (!rows || rows.length === 0) {
        throw new Error("CREDENCIAL_INVALIDA"); // Lanzamos un error controlado
    }

    const usuarioEncontrado = rows[0];
    const rol = usuarioEncontrado.ROL;
    const portal = rol_esperado.toLowerCase();

    if (portal === 'instructor') {
        // Puerta 1: Solo Instructores
        if (rolBD !== 'INSTRUCTOR') {
            throw new Error("ROL_INCORRECTO");
        }
    } 
    else if (portal === 'constancia' || portal === 'docente') {
        // Puerta 2: Aceptamos que Yaneli mande "constancia" o que tú mandes "docente" en pruebas
        if (rolBD !== 'DOCENTE' && rolBD !== 'ADMINISTRATIVO') {
            throw new Error("ROL_INCORRECTO");
        }
    } 
    else {
        // Puerta 3 (La trampa): Si alguien manda un rol inventado, vacío o mal escrito, lo rebotamos por defecto.
        throw new Error("ROL_INCORRECTO");
    }

    // 3. Lógica de negocio: Fabricar el Token
    const datosUsuario = {
        id: usuarioEncontrado.ID,
        rol: usuarioEncontrado.ROL,
        nombre: usuarioEncontrado.NOMBRE_COMPLETO
    };

    const token = jwt.sign(datosUsuario, "Mi_llave_secreta", { expiresIn: '2h' });

    // 4. Retornar el objeto limpio al Controller
    return {
        id: usuarioEncontrado.ID,
        rol: usuarioEncontrado.ROL,
        nombre: usuarioEncontrado.NOMBRE_COMPLETO,
        token: token
    };
}

module.exports = { procesarLogin };