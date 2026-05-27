const express = require('express');
const cors = require('cors');
const router = express.Router();
const authController = require('../controllers/authController');
const constanciaController = require('../controllers/constanciaController');
const { checkRole } = require('../middlewares/roleAuth');

router.get('/mis-constancias', checkRole(['DOCENTE', 'ADMINISTRATIVO', 'ADMINISTRADOR']), constanciaController.obtenerConstanciasDisponibles);

module.exports = router;