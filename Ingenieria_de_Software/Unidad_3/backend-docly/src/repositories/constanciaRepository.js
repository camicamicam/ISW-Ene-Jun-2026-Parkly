const db = require('../../config/db');
const oracledb = require('oracledb');

async function obtenerConstancia(idUsuario) {
    let connection;
    try {
        connection = await oracledb.getConnection(db);
        const query = `
            SELECT 
                id_inscripcion, 
                id_alumno, 
                nombre_completo_alumno, 
                nombre_curso, 
                total_horas,
                TO_CHAR(fecha_inicio, 'YYYY-MM-DD') AS fecha_inicio, 
                TO_CHAR(fecha_termino, 'YYYY-MM-DD') AS fecha_termino
            FROM v_alumnos_aprobados
            WHERE id_alumno = :idUsuario
        `;
        const result = await connection.execute(
            query, 
            { idUsuario }, 
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    } catch (error) {
        throw new Error('Error al conectar a la base de datos: ' + error.message);
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

module.exports = { obtenerConstancia };