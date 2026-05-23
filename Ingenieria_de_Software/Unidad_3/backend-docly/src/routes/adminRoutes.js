const express = require('express');
const cors = require('cors');
const router = express.Router();
const { checkRole } = require('../middlewares/roleAuth');
const adminController = require('../controllers/adminController');

router.post('/instructores', checkRole(['admin']), adminController.registrarInstructor);

router.put('/cursos/:idCurso', checkRole(['admin']), adminController.actualizarCurso);

router.delete('/cursos/:idCurso', checkRole(['admin']), adminController.eliminarCurso);

module.exports = router;