const express = require('express');
const cors = require('cors');
const router = express.Router();
const { checkRole } = require('../middlewares/roleAuth');
const adminController = require('../controllers/adminController');

router.post('/instructores', checkRole(['admin']), adminController);

router.put('/cursos/:idCurso', checkRole(['admin']), adminController);

router.delete('/cursos/:idCurso', checkRole(['admin']), adminController );

module.exports = router;