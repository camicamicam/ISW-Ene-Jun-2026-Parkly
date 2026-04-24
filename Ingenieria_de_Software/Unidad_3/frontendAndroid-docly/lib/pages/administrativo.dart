import 'package:flutter/material.dart';

class AdministrativoPage extends StatefulWidget {
  const AdministrativoPage({super.key});

  @override
  State<AdministrativoPage> createState() => _AdministrativoPageState();
}

class _AdministrativoPageState extends State<AdministrativoPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: const Center(
        child: Text(
          'Administrativo',
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
