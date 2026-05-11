import 'package:flutter/material.dart';
import 'package:docly/services/apis.dart';

class InstructorPage extends StatefulWidget {
  const InstructorPage({super.key});

  @override
  State<InstructorPage> createState() => _InstructorPageState();
}

class _InstructorPageState extends State<InstructorPage> {
  bool _isLoading = false;

  String tipoSeccion = 'Profesional';

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args != null && args is String) {
      tipoSeccion = args;
    }
  }

  // Controladores para Datos del Instructor
  final TextEditingController _numEmpCtrl = TextEditingController();
  final TextEditingController _nombreInstCtrl = TextEditingController();
  final TextEditingController _paternoCtrl = TextEditingController();
  final TextEditingController _maternoCtrl = TextEditingController();
  final TextEditingController _correoCtrl = TextEditingController();

  // Controladores para Datos del Curso
  final TextEditingController _nombreCursoCtrl = TextEditingController();
  final TextEditingController _fechaInicioCtrl = TextEditingController();
  final TextEditingController _fechaTerminoCtrl = TextEditingController();
  final TextEditingController _diasCtrl = TextEditingController();
  final TextEditingController _horarioCtrl = TextEditingController();

  // Lista dinámica para los Temas
  List<Map<String, TextEditingController>> _temas = [];

  @override
  void initState() {
    super.initState();
    // Agregamos un tema vacío por defecto al iniciar
    _agregarTema();
  }

  void _agregarTema() {
    setState(() {
      _temas.add({
        'titulo': TextEditingController(),
        'horas': TextEditingController(),
      });
    });
  }

  void _eliminarTema(int index) {
    if (_temas.length > 1) {
      setState(() {
        _temas.removeAt(index);
      });
    }
  }

  // Equivalente a normalizarTexto() de JS para quitar acentos
  String _normalizarTexto(String texto) {
    if (texto.isEmpty) return "";
    const conAcentos = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÑñ';
    const sinAcentos = 'AAAAAAaaaaaaOOOOOOooooooEEEEeeeeCcIIIIiiiiUUUUuuuuNn';
    String resultado = texto;
    for (int i = 0; i < conAcentos.length; i++) {
      resultado = resultado.replaceAll(conAcentos[i], sinAcentos[i]);
    }
    return resultado.trim();
  }

  Future<void> _enviarDatosApi() async {
    setState(() {
      _isLoading = true;
    });

    int totalHoras = 0;
    List<Map<String, dynamic>> temasFormateados = [];

    for (var tema in _temas) {
      int horas = int.tryParse(tema['horas']!.text) ?? 0;
      totalHoras += horas;
      temasFormateados.add({
        "titulo_tema": _normalizarTexto(tema['titulo']!.text),
        "horas_duracion": horas,
      });
    }

    final payload = {
      "curso": {
        "tipo_curso": tipoSeccion,
        "instructor_numero_empleado": int.tryParse(_numEmpCtrl.text) ?? 0,
        "instructor_nombre": _normalizarTexto(_nombreInstCtrl.text),
        "instructor_paterno": _normalizarTexto(_paternoCtrl.text),
        "instructor_materno": _normalizarTexto(_maternoCtrl.text),
        "instructor_correo": _correoCtrl.text.trim(),
        "nombre": _normalizarTexto(_nombreCursoCtrl.text),
        "duracion": totalHoras,
        "fecha_inicio": _fechaInicioCtrl.text,
        "fecha_termino": _fechaTerminoCtrl.text,
        "dias_semana": _normalizarTexto(_diasCtrl.text),
        "horario": _horarioCtrl.text.trim(),
      },
      "temas": temasFormateados,
    };

    final resultado = await ApiService.registrarCurso(payload);

    setState(() {
      _isLoading = false;
    });

    if (resultado['exito'] == true) {
      _mostrarMensaje(resultado['mensaje'], Colors.green);
      Navigator.pop(context);
    } else {
      _mostrarMensaje(resultado['mensaje'], Colors.red);
    }
  }

  void _mostrarConfirmacion() {
    int totalHoras = 0;
    for (var tema in _temas) {
      totalHoras += int.tryParse(tema['horas']!.text) ?? 0;
    }

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          title: Column(
            children: [
              const Text(
                'Confirmar Registro',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: Colors.blueGrey.shade700,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'MODALIDAD: $tipoSeccion',
                  style: const TextStyle(color: Colors.white, fontSize: 10),
                ),
              ),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Datos del Instructor',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.blueGrey,
                  ),
                ),
                const Divider(),
                _buildFilaResumen('N° Empleado:', _numEmpCtrl.text),
                _buildFilaResumen(
                  'Nombre Completo:',
                  '${_nombreInstCtrl.text} ${_paternoCtrl.text} ${_maternoCtrl.text}',
                ),
                _buildFilaResumen('Correo:', _correoCtrl.text),
                const SizedBox(height: 16),

                const Text(
                  'Datos del Curso',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.blueGrey,
                  ),
                ),
                const Divider(),
                _buildFilaResumen('Curso:', _nombreCursoCtrl.text),
                _buildFilaResumen('Total Horas:', '$totalHoras hrs'),
                _buildFilaResumen('Días:', _diasCtrl.text),
                _buildFilaResumen('Inicio:', _fechaInicioCtrl.text),
                _buildFilaResumen('Término:', _fechaTerminoCtrl.text),
                _buildFilaResumen('Horario:', _horarioCtrl.text),
              ],
            ),
          ),
          actionsAlignment: MainAxisAlignment.spaceEvenly,
          actions: [
            ElevatedButton(
              onPressed: () => Navigator.pop(context),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red.shade400,
                foregroundColor: Colors.white,
              ),
              child: const Text('Corregir'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                _enviarDatosApi();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green.shade600,
                foregroundColor: Colors.white,
              ),
              child: const Text('Registrar'),
            ),
          ],
        );
      },
    );
  }

  Widget _buildFilaResumen(String titulo, String valor) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            titulo,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              valor,
              style: const TextStyle(fontSize: 12),
              textAlign: TextAlign.right,
            ),
          ),
        ],
      ),
    );
  }

  void _mostrarMensaje(String mensaje, Color color) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(mensaje), backgroundColor: color));
  }

  Widget _buildTextField(
    String label,
    TextEditingController controller, {
    bool isNumber = false,
    String? hint,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.black87,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 6),
          TextField(
            controller: controller,
            keyboardType: isNumber ? TextInputType.number : TextInputType.text,
            decoration: InputDecoration(
              hintText: hint ?? label,
              hintStyle: const TextStyle(color: Colors.grey, fontSize: 13),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 12,
                vertical: 12,
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blueGrey.shade100,
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text('Registro de Curso'),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          // Envolvemos todo en una columna para poder poner la lista debajo
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // --- TARJETA 1: EL FORMULARIO ---
              Container(
                constraints: const BoxConstraints(maxWidth: 600),
                padding: const EdgeInsets.all(24.0),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: const [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 10,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Column(
                      children: [
                        const Text(
                          'Información del Curso',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.blue.shade50,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            'Sección: $tipoSeccion',
                            style: TextStyle(
                              color: Colors.blue.shade700,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    const Center(
                      child: Text(
                        'Datos del Instructor',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.black54,
                        ),
                      ),
                    ),
                    const Divider(),
                    _buildTextField(
                      'Número de Empleado',
                      _numEmpCtrl,
                      isNumber: true,
                      hint: 'Ej. 21140780',
                    ),
                    _buildTextField(
                      'Nombre del Instructor',
                      _nombreInstCtrl,
                      hint: 'Nombre',
                    ),
                    Row(
                      children: [
                        Expanded(
                          child: _buildTextField(
                            'Apellido Paterno',
                            _paternoCtrl,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _buildTextField(
                            'Apellido Materno',
                            _maternoCtrl,
                          ),
                        ),
                      ],
                    ),
                    _buildTextField(
                      'Correo Electrónico',
                      _correoCtrl,
                      hint: 'ejemplo@correo.com',
                    ),
                    const SizedBox(height: 24),

                    const Center(
                      child: Text(
                        'Datos del Curso',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.black54,
                        ),
                      ),
                    ),
                    const Divider(),
                    _buildTextField(
                      'Nombre del Curso',
                      _nombreCursoCtrl,
                      hint: 'Nombre de la materia',
                    ),
                    Row(
                      children: [
                        Expanded(
                          child: _buildTextField(
                            'Fecha Inicio',
                            _fechaInicioCtrl,
                            hint: 'dd/mm/aaaa',
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _buildTextField(
                            'Fecha Término',
                            _fechaTerminoCtrl,
                            hint: 'dd/mm/aaaa',
                          ),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(
                          child: _buildTextField(
                            'Días de la semana',
                            _diasCtrl,
                            hint: 'Ej. Lunes y Miércoles',
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _buildTextField(
                            'Horario',
                            _horarioCtrl,
                            hint: 'Ej. 10:00 - 12:00',
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    const Text(
                      'Temas',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 8),
                    ..._temas.asMap().entries.map((entry) {
                      int index = entry.key;
                      var tema = entry.value;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8.0),
                        child: Row(
                          children: [
                            Expanded(
                              flex: 3,
                              child: _buildTextField(
                                '',
                                tema['titulo']!,
                                hint: 'Título del tema',
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              flex: 1,
                              child: _buildTextField(
                                '',
                                tema['horas']!,
                                isNumber: true,
                                hint: 'Hrs',
                              ),
                            ),
                            const SizedBox(width: 8),
                            IconButton(
                              icon: const Icon(Icons.close, color: Colors.red),
                              onPressed: () => _eliminarTema(index),
                            ),
                          ],
                        ),
                      );
                    }).toList(),

                    ElevatedButton.icon(
                      onPressed: _agregarTema,
                      icon: const Icon(Icons.add),
                      label: const Text('Añadir módulo'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.grey,
                        foregroundColor: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 24),

                    _isLoading
                        ? const Center(child: CircularProgressIndicator())
                        : ElevatedButton(
                            onPressed: _mostrarConfirmacion,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.deepOrange,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                            ),
                            child: const Text(
                              'Guardar',
                              style: TextStyle(fontSize: 16),
                            ),
                          ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // --- TARJETA 2: LISTA DE CURSOS REGISTRADOS ---
              ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 600),
                child: MisCursosRegistrados(tipoSeccion: tipoSeccion),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// =====================================================================
// NUEVO COMPONENTE: LISTA DE CURSOS REGISTRADOS
// =====================================================================
class MisCursosRegistrados extends StatefulWidget {
  final String tipoSeccion;
  const MisCursosRegistrados({super.key, required this.tipoSeccion});

  @override
  State<MisCursosRegistrados> createState() => _MisCursosRegistradosState();
}

class _MisCursosRegistradosState extends State<MisCursosRegistrados> {
  List<dynamic> _cursos = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _cargarCursos();
  }

  Future<void> _cargarCursos() async {
    try {
      final cursosTotales = await ApiService.obtenerCatalogo();
      final cursosFiltrados = cursosTotales.where((curso) {
        final tipo = curso['TIPO_CURSO']?.toString() ?? '';
        return tipo.toLowerCase().contains(widget.tipoSeccion.toLowerCase());
      }).toList();

      if (mounted) {
        setState(() {
          _cursos = cursosFiltrados;
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error al cargar mis cursos: $e');
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 10, spreadRadius: 2),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Mis Cursos Registrados',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Color(0xFF2C3E50), // Azul oscuro de tu web
              ),
            ),
            const SizedBox(height: 20),

            _isLoading
                ? const Center(
                    child: Padding(
                      padding: EdgeInsets.all(20.0),
                      child: CircularProgressIndicator(),
                    ),
                  )
                : _cursos.isEmpty
                ? Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'No hay cursos de tipo "${widget.tipoSeccion}" registrados.',
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Colors.black54),
                    ),
                  )
                : ListView.builder(
                    shrinkWrap:
                        true, // Vital para que funcione dentro de un SingleChildScrollView
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _cursos.length,
                    itemBuilder: (context, index) {
                      final curso = _cursos[index];
                      final nombre = curso['NOMBRE_CURSO'] ?? 'Sin nombre';
                      final instructor = curso['INSTRUCTOR'] ?? 'Por asignar';
                      final horas = curso['TOTAL_HORAS'] ?? 0;
                      final dias = curso['DIAS_SEMANA'] ?? 'No especificado';

                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                          boxShadow: const [
                            BoxShadow(
                              color: Colors.black12,
                              blurRadius: 4,
                              offset: Offset(0, 2),
                            ),
                          ],
                          // El borde azul que le da el toque idéntico a la web
                          border: const Border(
                            left: BorderSide(
                              color: Color(0xFF2C3E50),
                              width: 5,
                            ),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              nombre,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF2C3E50),
                              ),
                            ),
                            const SizedBox(height: 6),
                            RichText(
                              text: TextSpan(
                                style: const TextStyle(
                                  fontSize: 13,
                                  color: Colors.black54,
                                ),
                                children: [
                                  const TextSpan(
                                    text: 'Instructor: ',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  TextSpan(text: '$instructor\n'),
                                  const TextSpan(
                                    text: 'Horas: ',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  TextSpan(text: '$horas | '),
                                  const TextSpan(
                                    text: 'Días: ',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  TextSpan(text: dias),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ],
        ),
      ),
    );
  }
}
