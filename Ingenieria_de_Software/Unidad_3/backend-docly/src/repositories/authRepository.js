const db = require('../../config/db');

async function verificarCredencialesPorCorreo(correo) {
    let connection;
    try {
        connection = await db.getConnection();

        const query = `
            SELECT 
                id_usuario AS id, 
                rol, 
                numero_empleado,
                correo,
                nombre_usuario, 
                apellido_p_usuario, 
                apellido_m_usuario,
                password_acceso
            FROM v_usuarios_roles
            WHERE correo = :correo
        `;

        const result = await connection.execute(query, { 
            correo: correo
        });

        return result.rows; 

    } catch (error) {
        console.error("Error en el modelo de auth:", error);
        throw error;
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}


async function verificarCredencialesPorNumEmp(numero_empleado) {
    let connection;
    try {
        connection = await db.getConnection();

        const query = `
            SELECT 
                id_usuario AS id, 
                rol, 
                numero_empleado,
                correo,
                nombre_usuario, 
                apellido_p_usuario, 
                apellido_m_usuario,
                password_acceso
            FROM v_usuarios_roles
            WHERE TO_CHAR(numero_empleado) = :num_emp
        `;

        const result = await connection.execute(query, { 
            num_emp: numero_empleado
        });

        return result.rows; 

    } catch (error) {
        console.error("Error en el modelo de auth:", error);
        throw error;
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

module.exports = { verificarCredencialesPorCorreo, verificarCredencialesPorNumEmp };