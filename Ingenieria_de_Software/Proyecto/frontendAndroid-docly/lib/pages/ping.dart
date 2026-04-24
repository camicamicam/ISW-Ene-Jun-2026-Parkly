import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class PingPage extends StatefulWidget {
  const PingPage({super.key});

  @override
  State<PingPage> createState() => _PingPageState();
}

class _PingPageState extends State<PingPage> {
  // Variable para guardar la respuesta del backend
  String _mensajeServidor = 'Ping';
  String _estadoSalud = 'Desconocido';
  //String _mensajeServidor = 'Presiona el botón para hacer ping';

  // Función asíncrona que se conecta a tu API
  Future<void> _hacerPing() async {
    setState(() {
      _mensajeServidor = 'Conectando al servidor...';
    });

    // Usando el endpoint /ping de tu imagen
    final url = Uri.parse('https://api-cursos-itq.onrender.com/ping');

    try {
      final respuesta = await http.get(url);

      setState(() {
        if (respuesta.statusCode == 200) {
          _mensajeServidor = respuesta.body;
        } else {
          _mensajeServidor = 'Error HTTP: ${respuesta.statusCode}';
        }
      });
    } catch (e) {
      setState(() {
        _mensajeServidor = 'Error de red. Revisa tu conexión.';
      });
      print('Detalle del error: $e');
    }
  }

  Future<void> _verificarHealth() async {
    setState(() {
      _estadoSalud = 'Consultando...';
    });

    // Usamos el endpoint /health de tu API en Render
    final url = Uri.parse('https://api-cursos-itq.onrender.com/health');

    try {
      final respuesta = await http.get(url);

      setState(() {
        if (respuesta.statusCode == 200) {
          // Asumiendo que tu API responde algo como {"status": "ok"}
          _estadoSalud = 'Servidor Saludable: ${respuesta.body}';
        } else {
          _estadoSalud = 'Problema en el servidor: ${respuesta.statusCode}';
        }
      });
    } catch (e) {
      setState(() {
        _estadoSalud = 'Error de conexión';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'Estado de la API:',
                style: TextStyle(fontSize: 38, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20), // Un pequeño espacio
              Text(
                _mensajeServidor,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 20),
              ),
              const SizedBox(height: 10),
              Text(
                'Estado: $_estadoSalud',
                style: const TextStyle(
                  fontSize: 20,
                  fontStyle: FontStyle.italic,
                ),
              ),
              const SizedBox(height: 50), // Espacio antes del nuevo botón
              // 2. NUEVO BOTÓN DE NAVEGACIÓN
              ElevatedButton.icon(
                onPressed: _hacerPing,
                icon: const Icon(Icons.wifi_calling),
                label: const Text('Enviar Ping'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 12,
                  ),
                  backgroundColor: Colors.deepPurple, // Color del botón
                  foregroundColor: Colors.white, // Color del texto e ícono
                ),
              ),
              ElevatedButton.icon(
                onPressed: _verificarHealth,
                icon: const Icon(Icons.heart_broken),
                label: const Text('Probar Health'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 12,
                  ),
                  backgroundColor: Colors.deepPurple, // Color del botón
                  foregroundColor: Colors.white, // Color del texto e ícono
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
