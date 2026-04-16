// 1. Importar las librerías
const express = require('express');
const cors = require('cors');
const db = require('./db');

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
        mensaje: 'El servidor de docly esta en línea y funcionando',
        timestamp: new Date()
    });
});

// ==========================================
// RUTA DE LOGIN (POST) - VERSIÓN ORACLE CLOUD
// ==========================================
// ==========================================
// RUTA DE LOGIN (POST) - MODO EMERGENCIA (MOCKUP)
// ==========================================
app.post('/api/auth/login', async (req, res) => {
    // 1. Extraemos los datos
    const { id_usuario, password_acceso } = req.body;

    // 2. Validamos que no vengan vacíos
    if (!id_usuario || !password_acceso) {
        return res.status(400).json({ 
            mensaje: 'Por favor ingresa ID de usuario y contraseña' 
        });
    }

    // 3. BYPASS: Validación directa (Simulando a Oracle)
    // Usamos los datos que sabemos que están en la BD de tu compañero
    if (id_usuario === "1" && password_acceso === "password") {
        return res.status(200).json({
            status: 'Éxito',
            mensaje: 'Login correcto (Modo Bypass). Bienvenido al TecNM.',
            usuario: "1", 
            token: 'token_de_prueba_jwt_12345'
        });
    } else {
        return res.status(401).json({ 
            mensaje: 'Credenciales incorrectas. Intenta de nuevo.' 
        });
    }
});
/*app.post('/api/auth/login', async (req, res) => {
    // 1. Extraemos los datos del body
    const { id_usuario, password_acceso } = req.body;

    // 2. Validamos que no vengan vacíos
    if (!id_usuario || !password_acceso) {
        return res.status(400).json({ 
            mensaje: 'Por favor ingresa ID de usuario y contraseña' 
        });
    }

    let connection; // Declaramos la variable aquí para poder cerrarla al final

    try {
        // 3. Pedimos la conexión a tu archivo db.js
        connection = await db.getConnection();

        // 4. Escribimos la consulta usando Bind Variables (:numero y :pass)
        const query = `
            SELECT * FROM instructor 
            WHERE id_usuario = :numero 
            AND password_acceso = :pass
        `;

        // 5. Ejecutamos la consulta pasándole los valores exactos
        const result = await connection.execute(query, {
            numero: id_usuario,
            pass: password_acceso
        });

        // 6. Oracle guarda las respuestas en result.rows
        if (result.rows && result.rows.length > 0) {
            // ¡Éxito!
            res.status(200).json({
                status: 'Éxito',
                mensaje: 'Login correcto en la nube. Bienvenido al TecNM.',
                // OJO: Oracle suele devolver las columnas en MAYÚSCULAS
                usuario: result.rows[0].ID_USUARIO, 
                token: 'token_de_prueba_jwt_12345'
            });
        } else {
            // No coincidieron los datos
            res.status(401).json({ 
                mensaje: 'Credenciales incorrectas. Intenta de nuevo.' 
            });
        }

    } catch (error) {
        console.error("Error en la base de datos Oracle:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    } finally {
        // 7. ¡EL PASO MÁS IMPORTANTE! Siempre liberar la conexión
        if (connection) {
            try {
                await connection.close();
            } catch (cerrarError) {
                console.error("Error al cerrar la conexión:", cerrarError);
            }
        }
    }
});*/

// ==========================================
// Iniciar el servidor                      |
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
    console.log(`Prueba el ping en: http://localhost:${PORT}/ping`);
    console.log(`Prueba el health en: http://localhost:${PORT}/health`);
});