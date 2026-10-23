const express = require('express');
const cors = require('cors');
const router = express.Router();
const { checkRole } = require('../middlewares/roleAuth');
const adminController = require('../controllers/adminController');

router.post('/instructores/registrar', checkRole(['ADMINISTRADOR']), adminController.registrarInstructor);
router.get('/instructores/obtener', checkRole(['ADMINISTRADOR']), adminController.listarInstructores);
router.patch('/instructores/:idInstructor/estado', checkRole(['ADMINISTRADOR']), adminController.actualizarEstadoInstructor);
router.put('/cursos/:idCurso', checkRole(['ADMINISTRADOR']), adminController.actualizarCurso);
router.delete('/cursos/:idCurso', checkRole(['ADMINISTRADOR']), adminController.eliminarCurso);

module.exports = router;