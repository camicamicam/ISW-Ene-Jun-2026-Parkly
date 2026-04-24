// 1. Importar las librerías
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');

// 2. Inicializar la aplicación
const app = express();

// 3. Configurar reglas del servidor
app.use(cors());
app.use(express.json());

//--------------------------
//      ENDPOINTS
//--------------------------

app.get('/ping', (req, res) => res.send('pong'));

app.get('/health', (req, res) => res.json({ 
    status: 'ok',
    success: true,
    message: 'Servicio funcionando correctamente',
    timestamp: new Date() 
}));

app.get('/hooligan', (req, res) => res.send('HA HA HA HA HA ¡Hooligan!'));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`Servidor backend funcionando en el puerto ${PORT}`);
});