import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // --- FUNCIÓN 1: LOGIN (Esta ya la tenías) ---
  static Future<bool> login(String password, String tipoPortal) async {
    try {
      final response = await http.post(
        Uri.parse('https://api-cursos-itq.onrender.com/api/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'password_acceso': password,
          'rol_esperado': tipoPortal,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print('Login exitoso: $data');

        if (data['token'] != null) {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('token', data['token']);
        }
        return true;
      } else {
        print('Credenciales incorrectas. Código: ${response.statusCode}');
        return false;
      }
    } catch (e) {
      print('Error de conexión: $e');
      return false;
    }
  }

  // --- FUNCIÓN 2: REGISTRAR CURSO (NUEVA) ---
  static Future<Map<String, dynamic>> registrarCurso(
    Map<String, dynamic> payload,
  ) async {
    try {
      // 1. Abrimos la caja fuerte y sacamos el token
      final prefs = await SharedPreferences.getInstance();
      final String? token = prefs.getString('token');

      // 2. Hacemos la petición con la pulsera VIP puesta
      final response = await http.post(
        Uri.parse('https://api-cursos-itq.onrender.com/api/cursos/registrar'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(payload),
      );

      // 3. Evaluamos la respuesta y devolvemos un mapa con el resultado
      if (response.statusCode == 200 || response.statusCode == 201) {
        return {'exito': true, 'mensaje': '¡Curso registrado con éxito!'};
      } else {
        final errorData = jsonDecode(response.body);
        return {
          'exito': false,
          'mensaje': errorData['message'] ?? 'Error al registrar el curso',
        };
      }
    } catch (e) {
      return {'exito': false, 'mensaje': 'Error de conexión: $e'};
    }
  }

  // --- FUNCIÓN 3: OBTENER CATÁLOGO ---
  // --- FUNCIÓN 3: OBTENER CATÁLOGO ---
  static Future<List<dynamic>> obtenerCatalogo() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? token = prefs.getString('token');

      final response = await http.get(
        Uri.parse('https://api-cursos-itq.onrender.com/api/cursos/catalogo'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        // Adaptado exactamente a como lo lee tu compañera: respuesta.datos || respuesta || []
        if (data is Map && data['datos'] != null) return data['datos'];
        if (data is List) return data;
        return [];
      } else {
        print('Error al obtener catálogo: ${response.statusCode}');
        return [];
      }
    } catch (e) {
      print('Error de conexión al catálogo: $e');
      return [];
    }
  }

  // --- FUNCIÓN 4: INSCRIBIR A CURSO ---
  static Future<Map<String, dynamic>> inscribir(
    Map<String, dynamic> payload,
    String tipo,
  ) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? token = prefs.getString('token');

      // ¡AHORA ES DINÁMICA! Tomará 'docente' o 'administrativo' según la pantalla
      final url =
          'https://api-cursos-itq.onrender.com/api/cursos/inscribir/${tipo.toLowerCase()}';

      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode(payload),
      );

      // Escudo por si la ruta no existe en el backend
      if (response.body.startsWith('<!DOCTYPE') ||
          response.body.startsWith('<html')) {
        return {
          'exito': false,
          'mensaje': 'Error del servidor (404). La ruta $url no existe.',
        };
      }

      if (response.statusCode == 200 || response.statusCode == 201) {
        return {'exito': true, 'mensaje': '¡Inscripción Exitosa!'};
      } else {
        final errorData = jsonDecode(response.body);
        return {
          'exito': false,
          'mensaje': errorData['message'] ?? 'Error al procesar la inscripción',
        };
      }
    } catch (e) {
      return {'exito': false, 'mensaje': 'Error de conexión: $e'};
    }
  }
}
