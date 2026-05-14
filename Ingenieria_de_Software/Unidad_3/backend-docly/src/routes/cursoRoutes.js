const express = require('express');
const cors = require('cors');
const router = express.Router();
const authController = require('../controllers/authController');
const cursoController = require('../controllers/cursoController');
const { checkRole } = require('../middlewares/roleAuth');

router.post('/inscribir/docente',cursoController.inscribirDocente);
router.post('/inscribir/administrativo', cursoController.inscribirAdministrativo);

router.post('/registrar', checkRole(['INSTRUCTOR']), cursoController.registrar);

router.get(
    '/disponibles', 
    checkRole(['INSTRUCTOR', 'DOCENTE', 'ADMINISTRATIVO']), 
    cursoController.obtenerCursos
);

router.get('/catalogo',cursoController.obtenerCursos);

router.get('/mis-cursos', checkRole(['INSTRUCTOR']), cursoController.obtenerCursosPorInstructor);

router.get('/alumnos/:idCurso', checkRole(['INSTRUCTOR']), cursoController.obtenerAlumnos);

router.patch('/alumnos/horas', checkRole(['INSTRUCTOR']), cursoController.actualizarHoras);

module.exports = router;