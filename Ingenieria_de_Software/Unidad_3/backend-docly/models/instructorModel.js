const db = require('../db'); 

async function verificarSoloPassword(password_acceso) {
    let connection;
    try {
        connection = await db.getConnection();

        const query = `
            SELECT * FROM vista_login 
            WHERE password_acceso = :pass
        `;

        const result = await connection.execute(query, {
            pass: password_acceso
        });

        // Regresamos todas las filas que coincidan
        return result.rows; 

    } catch (error) {
        console.error("Error en el modelo de instructor:", error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (cerrarError) {
                console.error("Error al cerrar conexión:", cerrarError);
            }
        }
    }
}

module.exports = { verificarSoloPassword };