import 'package:flutter/material.dart';
import 'package:docly/services/apis.dart';

class AdministrativoPage extends StatefulWidget {
  const AdministrativoPage({super.key});

  @override
  State<AdministrativoPage> createState() => _AdministrativoPageState();
}

class _AdministrativoPageState extends State<AdministrativoPage> {
  List<dynamic> _cursos = [];
  bool _isLoading = true;
  String tipoSeccion = 'Administrativo';

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args != null && args is String) {
      if (tipoSeccion != args) {
        tipoSeccion = args;
        _cargarCursos();
      }
    }
  }

  @override
  void initState() {
    super.initState();
    _cargarCursos();
  }

  Future<void> _cargarCursos() async {
    setState(() => _isLoading = true);
    try {
      final cursosTotales = await ApiService.obtenerCatalogo();
      final cursosFiltrados = cursosTotales.where((curso) {
        final tipo = curso['TIPO_CURSO']?.toString() ?? '';
        return tipo.toLowerCase().contains(tipoSeccion.toLowerCase());
      }).toList();

      setState(() {
        _cursos = cursosFiltrados;
        _isLoading = false;
      });
    } catch (e) {
      print('Error al cargar cursos: $e');
      setState(() => _isLoading = false);
    }
  }

  void _abrirFormulario(dynamic curso) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) =>
          FormularioAdministrativo(curso: curso, tipoSeccion: tipoSeccion),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text('Oferta Educativa'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 24.0, bottom: 8.0),
            child: Center(
              child: Text(
                tipoSeccion,
                style: const TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Colors.deepOrange,
                ),
              ),
            ),
          ),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 20.0),
            child: Text(
              'Selecciona el curso de tu interés para comenzar tu inscripción.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16, color: Colors.black54),
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(color: Colors.deepOrange),
                  )
                : _cursos.isEmpty
                ? Center(
                    child: Text(
                      'No hay cursos disponibles para la sección $tipoSeccion.',
                      style: const TextStyle(color: Colors.black45),
                    ),
                  )
                : RefreshIndicator(
                    onRefresh: _cargarCursos,
                    color: Colors.deepOrange,
                    child: ListView.builder(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16.0,
                        vertical: 8.0,
                      ),
                      itemCount: _cursos.length,
                      itemBuilder: (context, index) {
                        return _buildTarjetaCurso(_cursos[index]);
                      },
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildTarjetaCurso(dynamic curso) {
    final nombre = curso['NOMBRE_CURSO'] ?? 'Sin nombre';
    final duracion = curso['TOTAL_HORAS'] ?? 0;
    final instructor = curso['INSTRUCTOR'] ?? 'Por asignar';
    final dias = curso['DIAS_SEMANA'] ?? 'No especificado';
    final horario = curso['HORARIO'] ?? 'No especificado';

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.deepOrange.shade50,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '$duracion Hrs',
                      style: TextStyle(
                        color: Colors.deepOrange.shade700,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    nombre,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 12),
                  _buildFilaDetalle('Instructor: ', instructor),
                  const SizedBox(height: 4),
                  _buildFilaDetalle('Días: ', dias),
                  const SizedBox(height: 4),
                  _buildFilaDetalle('Horario: ', horario),
                ],
              ),
            ),
            const SizedBox(width: 16),
            ElevatedButton(
              onPressed: () => _abrirFormulario(curso),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.deepOrange,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
              ),
              child: const Text(
                'Seleccionar',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilaDetalle(String etiqueta, String valor) {
    return RichText(
      text: TextSpan(
        style: TextStyle(color: Colors.grey.shade700, fontSize: 13),
        children: [
          TextSpan(
            text: etiqueta,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.black54,
            ),
          ),
          TextSpan(text: valor),
        ],
      ),
    );
  }
}

// =====================================================================
// FORMULARIO ADMINISTRATIVO
// =====================================================================
class FormularioAdministrativo extends StatefulWidget {
  final dynamic curso;
  final String tipoSeccion;

  const FormularioAdministrativo({
    super.key,
    required this.curso,
    required this.tipoSeccion,
  });

  @override
  State<FormularioAdministrativo> createState() =>
      _FormularioAdministrativoState();
}

class _FormularioAdministrativoState extends State<FormularioAdministrativo> {
  final _numEmpCtrl = TextEditingController();
  final _nombreCtrl = TextEditingController();
  final _paternoCtrl = TextEditingController();
  final _maternoCtrl = TextEditingController();
  final _correoCtrl = TextEditingController();

  int? _deptoSeleccionado; // Aquí no hay Plaza
  bool _isLoading = false;

  final List<Map<String, dynamic>> _departamentos = [
    {"id": 22, "nombre": "Ciencias Económico Administrativas"},
    {"id": 23, "nombre": "Desarrollo Académico"},
    {"id": 24, "nombre": "División de Estudios Profesionales"},
    {"id": 35, "nombre": "División Posgrado e Investigación"},
    {"id": 26, "nombre": "Ingeniería Eléctrica y Electrónica"},
    {"id": 27, "nombre": "Ingeniería Industrial"},
    {"id": 28, "nombre": "Metal Mecánica"},
    {"id": 29, "nombre": "Sistemas y Computación"},
    {"id": 21, "nombre": "Ciencias Básicas"},
  ];

  void _mostrarResumenConfirmacion() {
    if (_numEmpCtrl.text.isEmpty ||
        _nombreCtrl.text.isEmpty ||
        _deptoSeleccionado == null) {
      _mostrarError('Por favor llena todos los campos');
      return;
    }

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Confirmar Registro',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
            ),
            SizedBox(height: 8),
            Divider(color: Colors.grey, thickness: 1),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildFilaResumen(
              'Curso:',
              widget.curso['NOMBRE_CURSO'] ?? 'No especificado',
            ),
            const Divider(color: Colors.black12, height: 20),
            _buildFilaResumen(
              'Personal:',
              '${_nombreCtrl.text.trim()} ${_paternoCtrl.text.trim()}',
            ),
            const Divider(color: Colors.black12, height: 20),
            _buildFilaResumen('N° Empleado:', _numEmpCtrl.text),
          ],
        ),
        actionsAlignment: MainAxisAlignment.spaceBetween,
        actionsPadding: const EdgeInsets.only(left: 20, right: 20, bottom: 20),
        actions: [
          Expanded(
            child: ElevatedButton(
              onPressed: () => Navigator.pop(ctx),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFE74C3C),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(6),
                ),
              ),
              child: const Text('Corregir'),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx);
                _ejecutarInscripcionFinal();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF27AE60),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(6),
                ),
              ),
              child: const Text('Finalizar'),
            ),
          ),
        ],
      ),
    );
  }

  void _ejecutarInscripcionFinal() async {
    setState(() => _isLoading = true);

    // Payload sin id_plaza
    final payload = {
      "numero_empleado": int.tryParse(_numEmpCtrl.text) ?? 0,
      "nombre": _nombreCtrl.text.trim(),
      "apellido_paterno": _paternoCtrl.text.trim(),
      "apellido_materno": _maternoCtrl.text.trim(),
      "correo": _correoCtrl.text.trim(),
      "id_departamento": _deptoSeleccionado,
      "id_curso": int.tryParse(widget.curso['ID_CURSO'].toString()) ?? 0,
    };

    // Forzamos "administrativo" directamente para asegurar que llegue al lugar correcto en el backend
    final resultado = await ApiService.inscribir(payload, 'administrativo');

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (resultado['exito'] == true) {
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(resultado['mensaje']),
          backgroundColor: Colors.green,
        ),
      );
    } else {
      _mostrarError(resultado['mensaje']);
    }
  }

  void _mostrarError(String mensaje) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        title: const Row(
          children: [
            Icon(Icons.error_outline, color: Colors.red),
            SizedBox(width: 8),
            Text('Aviso', style: TextStyle(color: Colors.red)),
          ],
        ),
        content: Text(mensaje),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Entendido'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        top: 24,
        left: 24,
        right: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              height: 4,
              decoration: BoxDecoration(
                color: Colors.blue,
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            const SizedBox(height: 16),

            const Text(
              'Datos Personales Administrativo',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1E293B),
              ),
            ),
            const SizedBox(height: 24),

            _buildInput('N° Empleado', _numEmpCtrl, isNumber: true),
            _buildInput('Nombre(s)', _nombreCtrl),
            Row(
              children: [
                Expanded(child: _buildInput('Ap. Paterno', _paternoCtrl)),
                const SizedBox(width: 16),
                Expanded(child: _buildInput('Ap. Materno', _maternoCtrl)),
              ],
            ),
            _buildInput('Correo Institucional', _correoCtrl, isEmail: true),

            // Dropdown de Departamento abarcando todo el ancho (sin plaza)
            _buildDropdown(
              'Departamento',
              _deptoSeleccionado,
              _departamentos,
              (val) => setState(() => _deptoSeleccionado = val),
            ),
            const SizedBox(height: 24),

            _isLoading
                ? const Center(child: CircularProgressIndicator())
                : ElevatedButton(
                    onPressed: _mostrarResumenConfirmacion,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF27AE60),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text(
                      'Revisar y Enviar',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilaResumen(String etiqueta, String valor) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          etiqueta,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
        ),
        Expanded(
          child: Text(
            valor,
            textAlign: TextAlign.right,
            style: const TextStyle(fontSize: 14, color: Colors.black87),
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }

  Widget _buildInput(
    String label,
    TextEditingController ctrl, {
    bool isNumber = false,
    bool isEmail = false,
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
              color: Color(0xFF1E293B),
              fontSize: 13,
            ),
          ),
          const SizedBox(height: 6),
          TextField(
            controller: ctrl,
            keyboardType: isNumber
                ? TextInputType.number
                : (isEmail ? TextInputType.emailAddress : TextInputType.text),
            decoration: InputDecoration(
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 12,
                vertical: 12,
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide(color: Colors.grey.shade300),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide(color: Colors.grey.shade300),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDropdown(
    String label,
    int? valorActual,
    List<Map<String, dynamic>> items,
    Function(int?) onChanged,
  ) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Color(0xFF1E293B),
              fontSize: 13,
            ),
          ),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey.shade300),
              borderRadius: BorderRadius.circular(8),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<int>(
                isExpanded: true,
                value: valorActual,
                items: items
                    .map(
                      (item) => DropdownMenuItem<int>(
                        value: item['id'],
                        child: Text(
                          item['nombre'],
                          style: const TextStyle(fontSize: 13),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    )
                    .toList(),
                onChanged: onChanged,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
