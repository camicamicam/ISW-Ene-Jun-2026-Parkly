const authRepository = require('../repositories/authRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function generarToken(usuarioEncontrado) {
    const datosUsuario = {
        id: usuarioEncontrado.ID,
        rol: usuarioEncontrado.ROL,
        nombre: usuarioEncontrado.NOMBRE_USUARIO
    };

    return jwt.sign(datosUsuario, "Mi_llave_secreta", { expiresIn: '2h' });
}

async function procesarLoginAdministrativo(correo, password_acceso, rol_esperado) {
    const rows = await authRepository.verificarCredencialesPorCorreo(correo);

    if (!rows || rows.length === 0) {
        throw new Error("CREDENCIAL_INVALIDA");
    }

    const usuarioEncontrado = rows[0];
    const rol = usuarioEncontrado.ROL;
    const portal = rol_esperado.toLowerCase();

    /*if(rol === 'ADMINISTRADOR' || rol === 'INSTRUCTOR'){
        if (!usuarioEncontrado.password_acceso) {
            throw new Error("CREDENCIAL_INVALIDA");
        }
        const passwordValido = await bcrypt.compare(password_acceso, usuarioEncontrado.password_acceso);
        if (!passwordValido) {
            throw new Error("CREDENCIAL_INVALIDA");
        }
    }else {
        throw new Error("ROL_INCORRECTO");
    }*/

    if (portal === 'instructor' || portal === 'administrador' || portal === 'admin') {
        if (rol !== 'INSTRUCTOR' && rol !== 'ADMINISTRADOR') throw new Error("ROL_INCORRECTO");
    } else {
        throw new Error("ROL_INCORRECTO");
    }

    if (!usuarioEncontrado.PASSWORD_ACCESO) throw new Error("CREDENCIAL_INVALIDA");
    const passwordValido = await bcrypt.compare(password_acceso, usuarioEncontrado.PASSWORD_ACCESO);
    if (!passwordValido) throw new Error("CREDENCIAL_INVALIDA");
    
    return {
        id: usuarioEncontrado.ID,
        rol: usuarioEncontrado.ROL,
        nombre_usuario: usuarioEncontrado.NOMBRE_USUARIO,
        apellido_p_usuario: usuarioEncontrado.APELLIDO_P_USUARIO,
        apellido_m_usuario: usuarioEncontrado.APELLIDO_M_USUARIO,
        numero_empleado: usuarioEncontrado.NUMERO_EMPLEADO,
        correo: usuarioEncontrado.CORREO,
        token: generarToken(usuarioEncontrado)
    };
}

async function procesarLoginDocente(numero_empleado, rol_esperado) {
    const rows = await authRepository.verificarCredencialesPorNumEmp(numero_empleado);

    if (!rows || rows.length === 0) {
        throw new Error("CREDENCIAL_INVALIDA");
    }

    const usuarioEncontrado = rows[0];
    const rol = usuarioEncontrado.ROL;
    const portal = rol_esperado.toLowerCase();

    /*if (portal === 'instructor' || portal === 'administrador') {
        if (rol !== 'INSTRUCTOR' && rol !== 'ADMINISTRADOR') {
            throw new Error("ROL_INCORRECTO");
        }
    } 
    else*/
    if (portal === 'constancia' || portal === 'docente' || portal === 'administrador') {
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
    
    return {
        id: usuarioEncontrado.ID,
        rol: usuarioEncontrado.ROL,
        nombre_usuario: usuarioEncontrado.NOMBRE_USUARIO,
        apellido_p_usuario: usuarioEncontrado.APELLIDO_P_USUARIO,
        apellido_m_usuario: usuarioEncontrado.APELLIDO_M_USUARIO,
        numero_empleado: usuarioEncontrado.NUMERO_EMPLEADO,
        correo: usuarioEncontrado.CORREO,
        token: generarToken(usuarioEncontrado)
    };
}

module.exports = { procesarLoginAdministrativo, procesarLoginDocente }; 