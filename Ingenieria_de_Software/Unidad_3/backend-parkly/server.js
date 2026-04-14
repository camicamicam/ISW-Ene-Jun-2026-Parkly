// 1. Importar las librerías
const express = require('express');
const cors = require('cors');

// 2. Inicializar la aplicación
const app = express();

// 3. Configurar reglas del servidor
app.use(cors());
app.use(express.json()); 

// ==========================================
// endpoints de prueba
// ==========================================

// /ping
app.get('/ping', (req, res) => {
    res.send('pong');
});

// /health
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        mensaje: 'El servidor de parkly esta en línea y funcionando',
        timestamp: new Date()
    });
});

// ==========================================
// Iniciar el servidor
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
    console.log(`Prueba el ping en: http://localhost:${PORT}/ping`);
});