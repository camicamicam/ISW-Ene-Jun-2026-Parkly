import 'package:docly/pages/constancia.dart';
import 'package:docly/pages/instructor.dart';
import 'package:flutter/material.dart';
import 'package:docly/pages/home.dart';
import 'package:docly/pages/ping.dart';
import 'package:docly/pages/login_instructor.dart';
import 'package:docly/pages/login_constancia.dart';
import 'package:docly/pages/docente.dart';
import 'package:docly/pages/administrativo.dart';

class Routes {
  static final routes = <String, WidgetBuilder>{
    '/': (context) => const HomePage(),
    'loginInstructor': (BuildContext context) => const LoginInstructor(),
    'docentePage': (BuildContext context) => const DocentePage(),
    'administrativoPage': (BuildContext context) => const AdministrativoPage(),
    'instructorPage': (BuildContext context) => const InstructorPage(),
    'loginConstancia': (BuildContext context) => const LoginConstancia(),
    'constanciaPage': (BuildContext context) => const ConstanciaPage(),
    'pingPage': (BuildContext context) => const PingPage(),
  };
}
