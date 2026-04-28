const { autoCommit } = require('oracledb');
const db = require('../../config/db');

async function guardarCurso(datosCurso, temas) {
    let connection;
    try {
        connection = await db.getConnection();

        const opciones = { autoCommit: false } ;

        const queryCurso = `
                BEGIN
                    alta_curso(:id_inst, :nom, :dur, :horas, :cupo, :anio, :per, :id_generado)
                END
            `;
        
            const bindVarCurso = {
                id_inst: datosCurso.id_instructor,
                nom: datosCurso.nombre,
                dur: datosCurso.duracion,
                horas: datosCurso.horas,
                cupo: datosCurso.cupo,
                anio: datosCurso.anio,
                per: datosCurso.periodo,
                id_generado: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            };

        const resultCurso = await connection.execute(queryCurso, bindVarCurso, opciones);

        const idNuevoCurso = resultCurso.outBinds.id_generado;

        const queryTema = `
                    BEGIN
                        alta_tema_curso(:id_curso, :titulo, :horas)
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

module.exports = { guardarCurso };