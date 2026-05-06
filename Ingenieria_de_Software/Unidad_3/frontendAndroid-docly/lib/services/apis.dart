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
}
