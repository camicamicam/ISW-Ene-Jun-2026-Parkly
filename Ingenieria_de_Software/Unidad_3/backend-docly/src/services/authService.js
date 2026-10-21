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

    if (portal === 'instructor' || portal === 'administrador') {
        if (rol !== 'INSTRUCTOR' && rol !== 'ADMINISTRADOR') {
            throw new Error("ROL_INCORRECTO");
        }
    } 
    else if (portal === 'constancia' || portal === 'docente' || portal === 'administrador') {
        if (rol !== 'DOCENTE' && rol !== 'ADMINISTRATIVO' && rol !== 'ADMINISTRADOR') {
            throw new Error("ROL_INCORRECTO");
        }
    }
    else if (portal === 'admin' || portal === 'administrador') {
        if (rol !== 'ADMINISTRADOR') { 
            throw new Error("ROL_INCORRECTO");
        }
    }
    else {
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
        nombre_usuario: usuarioEncontrado.NOMBRE_USUARIO,
        apellido_p_usuario: usuarioEncontrado.APELLIDO_P_USUARIO,
        apellido_m_usuario: usuarioEncontrado.APELLIDO_M_USUARIO,
        numero_empleado: usuarioEncontrado.NUMERO_EMPLEADO,
        correo: usuarioEncontrado.CORREO,
        token: token
    };
}

module.exports = { procesarLogin }; 