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

        let query = `SELECT * FROM v_detalle_cursos `;
        let bindVars = {};

        if (tipoFiltro) {
            query += `WHERE tipo_curso = :tipo `;
            bindVars.tipo = tipoFiltro;
        }

        query += `ORDER BY id_curso ASC`;
        //console.log("Query a ejecutar:", query);
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

async function obtenerCursosPorInstructor(idInstructor) {
    let connection;
    try {
        connection = await db.getConnection();
        const query = `
            SELECT * FROM v_detalle_cursos
            WHERE id_instructor = :idInstructor
            ORDER BY id_curso ASC
        `;
        const result = await connection.execute(query, { idInstructor }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return result.rows;
    } catch (error) {
        throw new Error("Error al obtener los cursos especificos: " + error.message);
        
    }finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

async function inscribirDocente(datos) {
    let connection;
    try {
        connection = await db.getConnection();
        const query = `
                BEGIN
                    inscribir_docente(
                        :p_num_empleado, :p_nombre, :p_ap_paterno, :p_ap_materno, :p_correo,
                        :p_id_depto, :p_id_plaza, :p_id_curso
                    );
                END;
                `;
        const bindVars = {
            p_num_empleado: datos.numero_empleado,
            p_nombre: datos.nombre,
            p_ap_paterno: datos.apellido_paterno,
            p_ap_materno: datos.apellido_materno,
            p_correo: datos.correo,
            p_id_depto: datos.id_departamento,
            p_id_plaza: datos.id_plaza,
            p_id_curso: datos.id_curso
        };
        await connection.execute(query, bindVars, { autoCommit: true });
        return true;
    } catch (error) {
        if (error.message.includes('-20010')) throw new Error('CUPO_LLENO');
        if (error.message.includes('-20011')) throw new Error('DUPLICADO');
        if (error.message.includes('-20012')) throw new Error('NO_EXISTE');
        if (error.message.includes('-20020')) throw new Error('DEPTO_NO_ACADEMICO');
        
        throw new Error("Error al inscribir al docente: " + error.message);
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

async function inscribirAdministrativo(datos) {
    let connection;
    try {
        connection = await db.getConnection();
        const query = `
            BEGIN
                inscribir_administrativo(
                    :p_num_empleado, :p_nombre, :p_ap_paterno, :p_ap_materno, :p_correo,
                    :p_id_depto, :p_id_curso
                );
            END;
        `;
        const bindVars = {
            p_num_empleado: datos.numero_empleado,
            p_nombre: datos.nombre,
            p_ap_paterno: datos.apellido_paterno,
            p_ap_materno: datos.apellido_materno,
            p_correo: datos.correo,
            p_id_depto: datos.id_departamento,
            p_id_curso: datos.id_curso
        };
        await connection.execute(query, bindVars, { autoCommit: true });
        return true;
    } catch (error) {
        if (error.message.includes('-20010')) throw new Error('CUPO_LLENO');
        if (error.message.includes('-20011')) throw new Error('DUPLICADO');
        if (error.message.includes('-20012')) throw new Error('NO_EXISTE');
        if (error.message.includes('-20020')) throw new Error('DEPTO_NO_ACADEMICO');
        
        throw new Error("Error al inscribir al docente: " + error.message);
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

async function obtenerAlumnosPorCurso(idCurso) {
    let connection;
    try {
        connection = await db.getConnection();
        const query = `
            SELECT * FROM v_inscripciones_detalle
            WHERE id_curso = :idCurso
            ORDER BY nombre_completo ASC
        `;
        const result = await connection.execute(query, { idCurso }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return result.rows;
    } catch (error) {
        throw new Error("Error al obtener los alumnos del curso: " + error.message);
    } finally{
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

async function actualizarHoras(idInscripcion, nuevasHoras) {
    let connection;
    try {
        connection = await db.getConnection();
        const query = `
            BEGIN
                REGISTRAR_HORAS_INSCRIPCION(:p_id_inscripcion, :p_horas_nuevas);
            END;
        `;
        
        const bindVars = {
            p_id_inscripcion: idInscripcion,
            p_horas_nuevas: nuevasHoras
        };

        await connection.execute(query, bindVars, { autoCommit: true });
        return true;
    } catch (error) {
        if(error.message.includes('-20031')) throw new Error("HORAS_SUPERAN_TOTAL");
        throw new Error("Error al actualizar las horas: " + error.message);
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }    
}

module.exports = { guardarCurso, obtenerCursos, obtenerCursosPorInstructor, inscribirDocente, inscribirAdministrativo, obtenerAlumnosPorCurso, actualizarHoras };