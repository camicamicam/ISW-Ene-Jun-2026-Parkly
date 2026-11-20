const oracledb = require('oracledb');
const db = require('../../config/db');

async function obtenerConstancia(idUsuario) {
    let connection;
    try {
        connection = await db.getConnection();
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

async function buscarDatosInscripcion(idInscripcion) {
    let connection;
    try {
        connection = await db.getConnection();
        const query = `
            SELECT * FROM v_alumnos_aprobados
            WHERE id_inscripcion = :idInscripcion
        `;
        const result = await connection.execute(
            query,
            { idInscripcion },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows[0] || null;
    } catch (error) {
        throw new Error('Error al conectar a la base de datos: ' + error.message);
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

async function buscarTemarioCurso(idCurso) {
    let connection;
    try {
        connection = await db.getConnection();
        const query = `
            SELECT titulo_tema, horas_duracion FROM v_tema_curso
            WHERE id_curso = :idCurso
        `;
        const result = await connection.execute(
            query,
            { idCurso },
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

async function generarFolioConstancia(idInscripcion) {
    let connection;
    try {
        connection = await db.getConnection();
        const result = await connection.execute(
            `  
            BEGIN
                generar_folio_constancia(
                    p_id_inscripcion => :p_id_inscripcion,
                    p_folio_numero   => :p_folio_numero,
                    p_folio          => :p_folio,
                    p_clave          => :p_clave
                );
            END;
            `,
            {
                p_id_inscripcion: idInscripcion,
                p_folio_numero: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                p_folio: {dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
                p_clave: {dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
            },
            { autoCommit: true }
        );

        return {
            folio_numero: result.outBinds.p_folio_numero,
            folio: result.outBinds.p_folio,
            clave: result.outBinds.p_clave
        };
    } catch (error) {
        if (error.message.includes('-20140')) throw new Error('REQUISITOS_INCOMPLETOS');
        throw new Error('Error al registrar constancia en BD: ' + error.message);
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

module.exports = { obtenerConstancia, buscarDatosInscripcion, buscarTemarioCurso, generarFolioConstancia };