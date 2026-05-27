const request = require('supertest');
const app = require('../server');

describe('Pruebas de Salud del Servidor', () => {
    
    test('El endpoint /ping debe responder "pong" con estatus 200', async () => {
        const response = await request(app).get('/ping');
        
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('pong');
    });

    test('El endpoint /health debe responder un JSON con success en true', async () => {
        const response = await request(app).get('/health');
        
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('ok');
        expect(response.body.success).toBe(true);
    });

    /*test('El endpoint /hooligan debe responder correctamente', async () => {
        const response = await request(app).get('/hooligan');
        
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('HA HA HA HA HA ¡Hooligan!');
    });*/
});