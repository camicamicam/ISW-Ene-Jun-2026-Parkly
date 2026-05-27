const request = require('supertest');
const app = require('../server');
const db = require('../config/db');

jest.setTimeout(15000);

describe('Flujo Completo: Autenticación, Seguridad y Datos', () => {
    
    // Variable global para guardar el token temporalmente durante la prueba
    let tokenAdministrador = '';

    test('1. [LOGIN] Debería iniciar sesión y generar un Token JWT válido', async () => {
        console.log('PASO 1: Intentando hacer login con el usuario administrador...');

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                password_acceso: 'AdminRoot2',
                rol_esperado: 'administrador'
            });

            console.log('Token recibido exitosamente:', response.body.token.substring(0, 20) + '...');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token'); // Exigimos que el backend nos dé un token
        
        // Guardamos el token en la variable para usarlo en el paso 3
        tokenAdministrador = response.body.token; 
    });

    test('2. [SEGURIDAD] Debería rebotar la petición si intentamos entrar sin Token', async () => {
        // Intentamos registrar un instructor, pero NO le mandamos el header de Authorization
        const response = await request(app)
            .post('/api/admin/instructores')
            .send({ nombre: 'Hacker', apellido_paterno: 'Malvado' });
        
            console.log(`Escudo activado. El servidor respondió con estatus: ${response.statusCode} (Acceso Denegado)`);

        // Exigimos que tu middleware checkRole responda con un 401 (No Autorizado) o 403
        expect([401, 403]).toContain(response.statusCode); 
    });

    test('3. [DATOS] Debería traer los cursos con el ID_INSTRUCTOR usando el Token', async () => {
        // Ahora sí, hacemos una petición enviando el Token como lo haría el Frontend
        const response = await request(app)
            .get('/api/cursos/disponibles')
            .set('Authorization', `Bearer ${tokenAdministrador}`);

        console.log(`Cursos obtenidos: ${response.body.datos.length}`);
        console.log('Muestra del primer curso:', response.body.datos[0]); // ¡Aquí verás tu ID_INSTRUCTOR!

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.datos)).toBe(true);
        expect(response.body.datos.length).toBeGreaterThan(0); // Que haya al menos 1 curso
        
        // La prueba de fuego: Verificar que el primer curso traiga la llave que agregamos
        expect(response.body.datos[0]).toHaveProperty('ID_INSTRUCTOR');
    });

});


jest.setTimeout(30000);

describe('Flujo Completo y Robusto (Con Setup y Teardown)', () => {
    
    let tokenAdministrador = '';

    // ---------------------------------------------------------
    // 1. SETUP: Preparar la escena (Se ejecuta ANTES de todo)
    // ---------------------------------------------------------
    beforeAll(async () => {
        console.log('[SETUP] Insertando a Pedrito Sola como administrador temporal...');
        let connection;
        try {
            connection = await db.getConnection();
            
            // Insertamos un administrador "falso" directo en Oracle solo para esta prueba
            await connection.execute(`
                INSERT INTO usuario (numero_empleado, nombre, apellido_paterno, apellido_materno, correo, nivel_acceso)
                VALUES (21140700, 'Pedrito', 'Sola', 'Chapoy', 'pedritosolachapoy@queretaro.tecnm.mx', 1)
            `);
                        
            // 2. Luego insertamos sus credenciales de administrador (sin punto y coma)
            await connection.execute(`
                INSERT INTO administrador (id_usuario, password_acceso)
                VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140700), 'password_123456')
            `);
            
            await connection.commit();
        } catch (error) {
            console.error('Error en el Setup:', error);
        } finally {
            if (connection) await connection.close();
        }
    });

    // ---------------------------------------------------------
    // 2. LAS PRUEBAS
    // ---------------------------------------------------------
    test('1. [LOGIN] Iniciar sesión con el usuario recién creado', async () => {
        console.log('PASO 1: Intentando hacer login con Pedrito Sola...');
        
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                password_acceso: 'password_123456',
                rol_esperado: 'administrador'
            });

        expect(response.statusCode).toBe(200);
        tokenAdministrador = response.body.token; 
        
        console.log(`Login exitoso. Token JWT capturado: ${tokenAdministrador.substring(0, 15)}...`);
    });

    test('2. [DATOS] Pidiendo los cursos...', async () => {
        console.log('PASO 2: Solicitando el catálogo de cursos disponibles usando el Token...');
        
        const response = await request(app)
            .get('/api/cursos/disponibles')
            .set('Authorization', `Bearer ${tokenAdministrador}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.datos)).toBe(true);
        
        console.log(`¡Éxito! El servidor devolvió un arreglo con ${response.body.datos.length} cursos.`);
    });

    // ---------------------------------------------------------
    // 3. TEARDOWN: Limpiar la escena (Se ejecuta DESPUÉS de todo)
    // ---------------------------------------------------------
    afterAll(async () => {
        console.log('[TEARDOWN] Borrando a Pedrito Sola y limpiando la BD...');
        let connection;
        try {
            connection = await db.getConnection();
            
            // 1. PRIMERO matamos al hijo (tabla administrador)
            await connection.execute(`
                DELETE FROM administrador 
                WHERE id_usuario = (SELECT id_usuario FROM usuario WHERE numero_empleado = 21140700)
            `);

            // 2. LUEGO matamos al padre (tabla usuario)
            await connection.execute(`
                DELETE FROM usuario 
                WHERE numero_empleado = 21140700
            `);
            
            await connection.commit();
            console.log('Base de datos impecable. Prueba finalizada.');
        } catch (error) {
            console.error('Error en el Teardown:', error);
        } finally {
            if (connection) await connection.close();
        }
    });

});