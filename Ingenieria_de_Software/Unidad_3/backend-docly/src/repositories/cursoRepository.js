const oracledb = require('oracledb');
const db = require('../../config/db');

async function guardarCurso(datosCurso, temas) {
    let connection;
    try {
        connection = await db.getConnection();

        const opciones = { autoCommit: false };

        const queryCurso = `
                BEGIN
                    alta_curso(
                        :p_num_empleado, :p_nombre_inst, :p_ap_paterno, :p_ap_materno, :p_correo,
                        :p_nombre_curso, :p_nombre_tipo, :p_duracion, :p_total_horas, :p_cupo_maximo, :p_anio, 
                        :p_periodo, :p_fecha_inicio, :p_fecha_termino, :p_dias_semana, :p_horario,
                        :p_id_curso_gen
                    );
                END;
            `;

        const bindVarCurso = {
            // Datos del instructor
            p_num_empleado: datosCurso.instructor_numero_empleado,
            p_nombre_inst: datosCurso.instructor_nombre,
            p_ap_paterno: datosCurso.instructor_paterno,
            p_ap_materno: datosCurso.instructor_materno,
            p_correo: datosCurso.instructor_correo,

            // Datos del curso
            p_nombre_curso: datosCurso.nombre,
            p_nombre_tipo: datosCurso.tipo_curso,
            p_duracion: datosCurso.duracion,
            p_total_horas: datosCurso.total_horas,
            p_cupo_maximo: datosCurso.cupo_maximo,
            p_anio: datosCurso.anio,
            p_periodo: datosCurso.periodo,
            p_fecha_inicio: datosCurso.fecha_inicio_obj,
            p_fecha_termino: datosCurso.fecha_termino_obj,
            p_dias_semana: datosCurso.dias_semana,
            p_horario: datosCurso.horario,

            // Salida
            p_id_curso_gen: {
                dir: oracledb.BIND_OUT, type: oracledb.NUMBER

            }
        };

        const resultCurso = await connection.execute(queryCurso, bindVarCurso, opciones);

        const idNuevoCurso = resultCurso.outBinds.p_id_curso_gen;

        const queryTema = `
                    BEGIN
                        alta_tema_curso(:id_curso, :titulo, :horas);
                    END;
            `;

        for (let tema of temas) {
            await connection.execute(queryTema, {
                id_curso: idNuevoCurso,
                titulo: tema.titulo_tema,
                horas: tema.horas_duracion
            }, opciones);
        }

        await connection.commit();

        return idNuevoCurso;

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        throw new Error("Error al guardar el curso: " + error.message);
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

async function obtenerCursos(tipoFiltro) {
    let connection;
    try {
        connection = await db.getConnection();

        const query = `SELECT * FROM v_detalle_cursos`;

        let bindVars = {};

        if (tipoFiltro) {
            query += `WHERE tipo_curso = :tipo`;
            bindVars.tipo = tipoFiltro;
        }

        query += `ORDER BY id_curso ASC`;
        const result = await connection.execute(query, bindVars, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        return result.rows;

    } catch (error) {
        throw new Error("Error al obtener los cursos: " + error.message);
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

module.exports = { guardarCurso, obtenerCursos };