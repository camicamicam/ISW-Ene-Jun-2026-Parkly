const authRepository = require('../repositories/authRepository');
const jwt = require('jsonwebtoken');

async function procesarLogin(credencial) {
    // 1. Pedirle al bodeguero que busque
    const rows = await authRepository.verificarCredenciales(credencial);

    // 2. Lógica de negocio: ¿Existe?
    if (!rows || rows.length === 0) {
        throw new Error("CREDENCIAL_INVALIDA"); // Lanzamos un error controlado
    }

    const usuarioEncontrado = rows[0];

    // 3. Lógica de negocio: Fabricar el Token
    const datosUsuario = {
        id: usuarioEncontrado.ID_REAL,
        rol: usuarioEncontrado.ROL
    };
    const token = jwt.sign(datosUsuario, "Mi_llave_secreta", { expiresIn: '2h' });

    // 4. Retornar el objeto limpio al Controller
    return {
        id: usuarioEncontrado.ID_REAL,
        rol: usuarioEncontrado.ROL,
        token: token
    };
}

module.exports = { procesarLogin };