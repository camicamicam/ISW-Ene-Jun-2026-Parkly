import 'package:flutter/material.dart';

class DocentePage extends StatefulWidget {
  const DocentePage({super.key});

  @override
  State<DocentePage> createState() => _DocentePageState();
}

class _DocentePageState extends State<DocentePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: const Center(
        child: Text(
          'Docente',
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
