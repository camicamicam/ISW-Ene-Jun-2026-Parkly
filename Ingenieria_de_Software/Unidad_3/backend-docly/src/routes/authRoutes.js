const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// La ruta real será /api/auth/login (lo configuramos en server.js)
router.post('/login', authController.login);

module.exports = router;