// models/instructorModel.js
const db = require('../db'); // Subimos un nivel para encontrar db.js

async function verificarCredenciales(id_usuario, password_acceso) {
    let connection;
    try {
        connection = await db.getConnection();

        const query = `
            SELECT * FROM vista_login 
            WHERE id_usuario = :numero 
            AND password_acceso = :pass
        `;

        const result = await connection.execute(query, {
            numero: id_usuario,
            pass: password_acceso
        });

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

module.exports = { verificarCredenciales };