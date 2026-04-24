import 'package:flutter/material.dart';

class ConstanciaPage extends StatefulWidget {
  const ConstanciaPage({super.key});

  @override
  State<ConstanciaPage> createState() => _ConstanciaPageState();
}

class _ConstanciaPageState extends State<ConstanciaPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: const Center(
        child: Text(
          'Constancia',
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: Colors.deepPurple,
          ),
        ),
      ),
    );
  }
}
