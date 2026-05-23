const express = require('express');
const cors = require('cors');
const router = express.Router();
const authController = require('../controllers/authController');
const cursoController = require('../controllers/cursoController');
const { checkRole } = require('../middlewares/roleAuth');

router.post('/inscribir/docente',cursoController.inscribirDocente);
router.post('/inscribir/administrativo', cursoController.inscribirAdministrativo);

router.post('/registrar', checkRole(['INSTRUCTOR', 'ADMINISTRADOR']), cursoController.registrar);

router.get(
    '/disponibles', 
    checkRole(['INSTRUCTOR', 'DOCENTE', 'ADMINISTRATIVO', 'ADMINISTRADOR']), 
    cursoController.obtenerCursos
);

router.get('/catalogo',cursoController.obtenerCursos);

router.get('/mis-cursos', checkRole(['INSTRUCTOR', 'ADMINISTRADOR']), cursoController.obtenerCursosPorInstructor);

router.get('/alumnos/:idCurso', checkRole(['INSTRUCTOR', 'ADMINISTRADOR']), cursoController.obtenerAlumnos);

router.patch('/alumnos/horas', checkRole(['INSTRUCTOR', 'ADMINISTRADOR']), cursoController.actualizarHoras);

module.exports = router;