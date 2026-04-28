const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { checkRole } = require('../middlewares/roleAuth');

router.post('/registrar', checkRole(['INSTRUCTOR']), require('../controllers/cursoController').registrar);

module.exports = router;