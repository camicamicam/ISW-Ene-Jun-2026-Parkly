import 'package:dockly/pages/constancia.dart';
import 'package:dockly/pages/instructor.dart';
import 'package:flutter/material.dart';
import 'package:dockly/pages/home.dart';
import 'package:dockly/pages/ping.dart';
import 'package:dockly/pages/login.dart';
import 'package:dockly/pages/docente.dart';
import 'package:dockly/pages/administrativo.dart';

class Routes {
  static final routes = <String, WidgetBuilder>{
    '/': (context) => const HomePage(),
    'loginPage': (BuildContext context) => const LoginPage(),
    'docentePage': (BuildContext context) => const DocentePage(),
    'administrativoPage': (BuildContext context) => const AdministrativoPage(),
    'instructorPage': (BuildContext context) => const InstructorPage(),
    'constanciaPage': (BuildContext context) => const ConstanciaPage(),
    'pingPage': (BuildContext context) => const PingPage(),
  };
}
