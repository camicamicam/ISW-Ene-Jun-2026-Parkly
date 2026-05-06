import 'package:flutter/material.dart';
import 'package:docly/services/apis.dart';

class LoginConstancia extends StatefulWidget {
  const LoginConstancia({super.key});

  @override
  State<LoginConstancia> createState() => _LoginConstanciaState();
}

class _LoginConstanciaState extends State<LoginConstancia> {
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false;
  bool _obscurePassword = true;

  Future<void> _iniciarSesion() async {
    String password = _passwordController.text;
    String tipoPortal = 'constancia';

    if (password.isEmpty) {
      _mostrarMensaje('Por favor, ingresa tu clave.');
      return;
    }

    setState(() {
      _isLoading = true;
    });

    bool loginExitoso = await ApiService.login(password, tipoPortal);

    setState(() {
      _isLoading = false;
    });

    if (loginExitoso) {
      // 1. Limpiamos el campo de texto de la contraseña
      _passwordController.clear();

      Navigator.pushReplacementNamed(context, 'constanciaPage');
    } else {
      _mostrarMensaje('Credenciales incorrectas o error de conexión.');
    }
  }

  void _mostrarMensaje(String mensaje) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(mensaje)));
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
                'Acceso a Constancias',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 50,
                  fontWeight: FontWeight.w400,
                  color: Color.fromARGB(255, 0, 0, 0),
                  fontFamily: 'DancingScript',
                ),
              ),
              const SizedBox(height: 20),

              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  color: Colors.grey.shade200,
                  border: Border(
                    left: BorderSide(
                      color: Colors.blueGrey.shade800,
                      width: 4.0,
                    ),
                  ),
                ),
                child: RichText(
                  textAlign: TextAlign.center,
                  text: const TextSpan(
                    style: TextStyle(color: Colors.black87, fontSize: 14),
                    children: [
                      TextSpan(
                        text: 'Nota: ',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      TextSpan(
                        text:
                            'La clave fue proporcionada en su correo de confirmación.',
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 20),

              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(30),
                ),
                child: TextField(
                  controller: _passwordController,
                  decoration: InputDecoration(
                    hintText: 'Ingrese su clave:',
                    hintStyle: const TextStyle(color: Colors.grey),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 15,
                    ),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword
                            ? Icons.visibility_off
                            : Icons.visibility,
                        color: Colors.grey,
                      ),
                      onPressed: () {
                        setState(() {
                          _obscurePassword = !_obscurePassword;
                        });
                      },
                    ),
                  ),
                  obscureText: _obscurePassword,
                  textAlignVertical: TextAlignVertical.center,
                ),
              ),
              const SizedBox(height: 20),
              _isLoading
                  ? const CircularProgressIndicator()
                  : ElevatedButton(
                      onPressed: _iniciarSesion,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.deepOrange,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 50,
                          vertical: 15,
                        ),
                      ),
                      child: const Text(
                        'INGRESAR',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w400,
                          color: Color.fromARGB(255, 255, 255, 255),
                          fontFamily: 'DancingScript',
                        ),
                      ),
                    ),
            ],
          ),
        ),
      ),
    );
  }
}
