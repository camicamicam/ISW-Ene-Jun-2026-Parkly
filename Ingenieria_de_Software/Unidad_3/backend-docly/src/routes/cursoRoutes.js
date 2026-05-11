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

module.exports = router;