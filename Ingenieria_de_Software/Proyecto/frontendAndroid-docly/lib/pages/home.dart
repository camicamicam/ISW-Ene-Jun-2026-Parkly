import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String? _tipo;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text('DOCLY'),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 40.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center, // Centra verticalmente
            children: [
              const Text(
                'ITQ',
                style: TextStyle(
                  fontSize: 40,
                  fontWeight: FontWeight.bold,
                  color: Colors.deepPurple,
                ),
              ),
              const SizedBox(height: 40), // Espacio entre el texto y el menú
              // Contenedor para darle un estilo más bonito al dropdown en el centro
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.deepPurple, width: 1),
                ),
                child: DropdownButton<String>(
                  hint: const Text("Curso de actualización Profesional"),
                  value: _tipo,
                  isExpanded:
                      true, // Hace que el botón ocupe todo el ancho del contenedor
                  underline: Container(), // Quitamos la línea fea de abajo
                  items: <String>['Docente', 'Administrativo', 'Instructor']
                      .map((String valor) {
                        return DropdownMenuItem<String>(
                          value: valor,
                          child: Text(valor),
                        );
                      })
                      .toList(),
                  onChanged: (String? nuevoValor) {
                    setState(() {
                      _tipo = nuevoValor;
                    });

                    // Tu lógica de navegación
                    switch (nuevoValor) {
                      case 'Docente':
                        Navigator.pushNamed(context, 'docentePage');
                        _tipo = null;
                        break;
                      case 'Administrativo':
                        Navigator.pushNamed(context, 'administrativoPage');
                        _tipo = null;
                        break;
                      case 'Instructor':
                        Navigator.pushNamed(context, 'loginPage');
                        _tipo = null;
                        break;
                    }
                  },
                ),
              ),

              const SizedBox(height: 10), // Espacio entre el texto y el menú
              // Contenedor para darle un estilo más bonito al dropdown en el centro
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.deepPurple, width: 1),
                ),
                child: DropdownButton<String>(
                  hint: const Text("Curso de actualización Docente"),
                  value: _tipo,
                  isExpanded:
                      true, // Hace que el botón ocupe todo el ancho del contenedor
                  underline: Container(), // Quitamos la línea fea de abajo
                  items: <String>['Docente', 'Administrativo', 'Instructor']
                      .map((String valor) {
                        return DropdownMenuItem<String>(
                          value: valor,
                          child: Text(valor),
                        );
                      })
                      .toList(),
                  onChanged: (String? nuevoValor) {
                    setState(() {
                      _tipo = nuevoValor;
                    });

                    // Tu lógica de navegación
                    switch (nuevoValor) {
                      case 'Docente':
                        Navigator.pushNamed(context, 'docentePage');
                        _tipo = null;
                        break;
                      case 'Administrativo':
                        Navigator.pushNamed(context, 'administrativoPage');
                        _tipo = null;
                        break;
                      case 'Instructor':
                        Navigator.pushNamed(context, 'loginPage');
                        _tipo = null;
                        break;
                    }
                  },
                ),
              ),
              const SizedBox(height: 10),
              ElevatedButton.icon(
                onPressed: () {
                  // Asegúrate de tener 'constanciasPage' definida en tu routes.dart
                  Navigator.pushNamed(context, 'constanciaPage');
                },
                icon: const Icon(Icons.description), // Un icono de documento
                label: const Text('Ver mis Constancias'),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(
                    double.infinity,
                    50,
                  ), // Mismo ancho que el dropdown
                  backgroundColor: Colors.deepPurple, // Color llamativo
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushNamed(context, 'pingPage');
        }, // Asignamos nuestra función al botón
        tooltip: 'Enviar Ping',
        child: const Icon(Icons.wifi), // Cambié el ícono de '+' por uno de wifi
      ),
    );
  }
}
