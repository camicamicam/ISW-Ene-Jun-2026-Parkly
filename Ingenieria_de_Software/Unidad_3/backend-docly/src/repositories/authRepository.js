const db = require('../config/db');

async function verificarCredenciales(password_acceso) {
    let connection;
    try {
        connection = await db.getConnection();

        const query = `
            SELECT * FROM v_usuarios_roles
            WHERE password_acceso = :pass OR TO_CHAR(numero_empleado) = :pass
        `;

        const result = await connection.execute(query, {
            pass: password_acceso
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

module.exports = { verificarCredenciales };