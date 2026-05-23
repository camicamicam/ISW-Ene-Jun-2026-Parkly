const express = require('express');
const cors = require('cors');
const router = express.Router();
const { checkRole } = require('../middlewares/roleAuth');
const adminController = require('../controllers/adminController');

router.post('/instructores', checkRole(['ADMINISTRADOR']), adminController.registrarInstructor);

router.put('/cursos/:idCurso', checkRole(['ADMINISTRADOR']), adminController.actualizarCurso);

router.delete('/cursos/:idCurso', checkRole(['ADMINISTRADOR']), adminController.eliminarCurso);

module.exports = router;