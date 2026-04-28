const cursoService = require('../services/cursoService');

async function registrar(req, res) {
    const { curso, temas } = req.body;

    if (!curso || !temas || temas.length === 0) {
        return res.status(400).json({ mensaje: 'Faltan los datos del curso o el temario está vacío.' });
    }

    try {
        const resultado = await cursoService.crearCurso(curso, temas);
        
        res.status(201).json({ 
            status: 'Éxito', 
            mensaje: resultado.mensaje,
            id_curso: resultado.id_curso
        });

    } catch (error) {
        switch(error.message) {
            case "HORAS_INVALIDAS":
                return res.status(400).json({ mensaje: 'Las horas totales deben estar entre 1 y 40.' });
            case "CUPO_INVALIDO":
                return res.status(400).json({ mensaje: 'El cupo debe estar entre 1 y 35 alumnos.' });
            case "PERIODO_INVALIDO":
                return res.status(400).json({ mensaje: 'El periodo solo puede ser 1 o 2.' });
            case "DESCUADRE_DE_HORAS":
                return res.status(400).json({ mensaje: 'La suma de horas del temario no coincide con las horas totales del curso.' });
            default:
                console.error(error);
                return res.status(500).json({ mensaje: 'Error al registrar el curso en el servidor (tal vez no hay base de datos).' });
        }
    }
}

module.exports = { registrar };