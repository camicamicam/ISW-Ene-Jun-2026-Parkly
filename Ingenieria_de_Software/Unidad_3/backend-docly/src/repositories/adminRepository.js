const oracledb = require('oracledb');
const db = require('../../config/db');

async function guardarInstructor(datos) {
    let connection;
    try {
        connection = await db.getConnection();

        const query = `
            BEGIN
                registrar_instructor(:p_num_empleado, :p_nombre, :p_ap_paterno, :p_ap_materno, :p_correo, :p_password);
            END;
        `;
        const bindVars = {
            p_num_empleado: datos.numero_empleado,
            p_nombre: datos.nombre,
            p_ap_paterno: datos.apellido_paterno,
            p_ap_materno: datos.apellido_materno,
            p_correo: datos.correo,
            p_password: datos.password_acceso
        };
        await connection.execute(query, bindVars, { autoCommit: true });
        return { mensaje: 'Instructor registrado exitosamente.' };
    } catch (error) {
        if(error.message.includes('-20030')) throw new Error('DATOS_INCOHERENTES');
        if(error.message.includes('-20050')) throw new Error('YA_ES_INSTRUCTOR');
        throw new Error("Error al guardar el instructor: " + error.message);
    }finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

async function editarCurso(idCurso, curso, temas) {
    let connection;
    try {
        connection = await db.getConnection();
        const TipoListaTemas = await connection.getDbObjectClass('ADMIN.T_LISTA_TEMAS');
        const TipoTema = await connection.getDbObjectClass('ADMIN.T_TEMA_OBJETO');
        const temasOracle = temas.map(tema => {
            const objTema = new TipoTema();
            objTema.TITULO_TEMA = tema.titulo_tema;
            objTema.HORAS_DURACION = tema.horas_duracion;
            return objTema;
        });
        const listaNuevosTemas = new TipoListaTemas(temasOracle);
        const query = `
            BEGIN
                actualizar_curso_y_temas(
                :p_id_curso, :p_nombre, :p_cupo_maximo, :p_anio,
                :p_periodo, :p_id_tipo_curso, :p_fecha_inicio, :p_fecha_termino,
                :p_dias_semana, :p_horario, :p_id_instructor, :p_nuevos_temas
                );
            END;
        `;
        
        const bindVars = {
            p_id_curso: idCurso,
            p_nombre: curso.nombre,
            p_cupo_maximo: curso.cupo_maximo,
            p_anio: curso.anio,
            p_periodo: curso.periodo,
            p_id_tipo_curso: curso.id_tipo_curso,
            p_fecha_inicio: curso.fecha_inicio,
            p_fecha_termino: curso.fecha_termino,
            p_dias_semana: curso.dias_semana,
            p_horario: curso.horario,
            p_id_instructor: curso.id_instructor,
            p_nuevos_temas: {
                type: oracledb.DB_TYPE_OBJECT,
                dir:  oracledb.BIND_IN,
                val:  listaNuevosTemas,
                typeClass: TipoListaTemas 
            }
        };
        await connection.execute(query, bindVars, { autoCommit: true });
        return { mensaje: 'Curso actualizado exitosamente.' };
    } catch (error) {
        if(error.message.includes('-20040')) throw new Error('NO_EXISTE');
        throw new Error("Error al editar el curso: " + error.message);
    }finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

async function eliminarCurso(idCurso) {
    let connection;
    try {
        connection = await db.getConnection();
        const query = `
            BEGIN
                eliminar_curso(:p_id_curso);
            END;
        `;
        const bindVars = {
            p_id_curso: idCurso
        };
        await connection.execute(query, bindVars, { autoCommit: true });
        return { mensaje: 'Curso eliminado exitosamente.' };
    } catch (error) {
        if (error.message.includes('-20112')) throw new Error('CURSO_CON_INSCRITOS');
        if(error.message.includes('-20110')) throw new Error('NO_EXISTE');
        throw new Error("Error al eliminar el curso: " + error.message);
    }finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

module.exports = { guardarInstructor, editarCurso, eliminarCurso };