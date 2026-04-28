const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const cursoController = require('../controllers/cursoController');
const { checkRole } = require('../middlewares/roleAuth');

router.post('/registrar', checkRole(['INSTRUCTOR']), cursoController.registrar);

module.exports = router;