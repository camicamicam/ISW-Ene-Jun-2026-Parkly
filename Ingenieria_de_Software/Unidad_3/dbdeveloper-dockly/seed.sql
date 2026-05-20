---PLAZAS---
INSERT INTO tipo_plaza (nombre) VALUES ('Plaza de Tiempo Completo');
INSERT INTO tipo_plaza (nombre) VALUES ('Plaza de Medio Tiempo');
INSERT INTO tipo_plaza (nombre) VALUES ('Plaza por Honorarios');
INSERT INTO tipo_plaza (nombre) VALUES ('Plaza 3/4');
INSERT INTO tipo_plaza (nombre) VALUES ('Plaza Asignatura');

---DEPARTAMENTO---
INSERT INTO departamento (nombre, es_academico) VALUES ('Ciencias Básicas',1);
INSERT INTO departamento (nombre, es_academico) VALUES ('Ciencias Económico Administrativas',0);
INSERT INTO departamento (nombre, es_academico) VALUES ('Desarrollo Académico',0);
INSERT INTO departamento (nombre, es_academico) VALUES ('División de Estudios Profesionales',0);
INSERT INTO departamento (nombre, es_academico) VALUES ('División Posgrado e Investigación',0);
INSERT INTO departamento (nombre, es_academico) VALUES ('Ingeniería Eléctrica y Electrónica',1);
INSERT INTO departamento (nombre, es_academico) VALUES ('Ingeniería Industrial',1);
INSERT INTO departamento (nombre, es_academico) VALUES ('Metal Mecánica',1);
INSERT INTO departamento (nombre, es_academico) VALUES ('Sistemas y Computación',1);

--TIPO DE CURSOS--
INSERT INTO tipo_curso (nombre) VALUES ('Docente');
INSERT INTO tipo_curso (nombre) VALUES ('Profesional');

---USUARIOS---

INSERT INTO usuario (numero_empleado, nombre, apellido_paterno, apellido_materno, correo, nivel_acceso)
VALUES (21140001, 'Ivan', 'Alfaro', 'Dominguez', 'ivan.alfaro@queretaro.tecnm.mx', 0);

INSERT INTO usuario (numero_empleado, nombre, apellido_paterno, apellido_materno, correo, nivel_acceso)
VALUES (21140901, 'Carlos', 'Jiménez', 'Pérez', 'carlos.jimenez@queretaro.tecnm.mx', 0);

INSERT INTO usuario (numero_empleado, nombre, apellido_paterno, apellido_materno, correo, nivel_acceso)
VALUES (21140902, 'Beatriz', 'Luna', 'Solís', 'beatriz.luna@queretaro.tecnm.mx', 0);

INSERT INTO usuario (numero_empleado, nombre, apellido_paterno, apellido_materno, correo, nivel_acceso)
VALUES (21140002, 'Yaneli', 'Diaz', 'Garcia', 'yaneli.diaz@queretaro.tecnm.mx', 0);

INSERT INTO usuario (numero_empleado, nombre, apellido_paterno, apellido_materno, correo, nivel_acceso)
VALUES (21140903, 'Roberto', 'Toscano', 'Reyes', 'roberto.toscano@queretaro.tecnm.mx', 0);

INSERT INTO usuario (numero_empleado, nombre, apellido_paterno, apellido_materno, correo, nivel_acceso)
VALUES (21140904, 'Lucía', 'Fernández', 'Cruz', 'lucia.fernandez@queretaro.tecnm.mx', 0);

INSERT INTO usuario (numero_empleado, nombre, apellido_paterno, apellido_materno, correo, nivel_acceso) 
VALUES (21140780, 'Camila', 'Mata', 'Garcia', 'camila.mata@queretaro.tecnm.mx', 0);

INSERT INTO usuario (numero_empleado, nombre, apellido_paterno, apellido_materno, correo, nivel_acceso)
VALUES (21140905, 'Sergio', 'Mendoza', 'Bravo', 'sergio.mendoza@queretaro.tecnm.mx', 0);

INSERT INTO usuario (numero_empleado, nombre, apellido_paterno, apellido_materno, correo, nivel_acceso)
VALUES (21140906, 'Gabriela', 'Ruiz', 'Vaca', 'gabriela.ruiz@queretaro.tecnm.mx', 0);

INSERT INTO usuario (numero_empleado, nombre, apellido_paterno, apellido_materno, correo, nivel_acceso)
VALUES (21140907, 'Camila', 'Hernández', 'Gallegos', 'camila.gallegos@queretaro.tecnm.mx', 1);

INSERT INTO usuario (numero_empleado, nombre, apellido_paterno, apellido_materno, correo, nivel_acceso)
VALUES (21140908, 'Jhoel', 'Hernández', 'Perrusquia', 'jhoel.hernandez@queretaro.tecnm.mx', 1);

INSERT INTO usuario (numero_empleado, nombre, apellido_paterno, apellido_materno, correo, nivel_acceso)
VALUES (21140909, 'Adriana', 'Sosa', 'Melo', 'adriana.sosa@queretaro.tecnm.mx', 1);

INSERT INTO usuario (numero_empleado, nombre, apellido_paterno, apellido_materno, correo, nivel_acceso)
VALUES (999, 'Admin', 'ISW', 'Julio', 'admin@admin.com', 0);

---DOCENTE---
INSERT INTO docente (id_usuario, id_plaza, id_departamento)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140001), 1, 9); -- Sistemas y Computación

INSERT INTO docente (id_usuario, id_plaza, id_departamento)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140901), 1, 1); -- Ciencias Básicas

INSERT INTO docente (id_usuario, id_plaza, id_departamento)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140902), 2, 6); -- Ing. Eléctrica

---ADMINISTRATIVO---
INSERT INTO administrativo (id_usuario, id_departamento)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140002), 9);

INSERT INTO administrativo (id_usuario, id_departamento)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140903), 8);

INSERT INTO administrativo (id_usuario, id_departamento)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140904), 2);

---INSTRUCTOR---
INSERT INTO instructor (id_usuario, password_acceso) 
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140780), 'password');

INSERT INTO instructor (id_usuario, password_acceso)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140905), 'Sergio1234');

INSERT INTO instructor (id_usuario, password_acceso)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140906), 'Gaby1234');

INSERT INTO instructor (id_usuario, password_acceso)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 999), '1234@abc');

---ADMINISTRADOR---

INSERT INTO administrador (id_usuario, password_acceso)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140907), 'AdminRoot1');

INSERT INTO administrador (id_usuario, password_acceso)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140908), 'AdminRoot2');

INSERT INTO administrador (id_usuario, password_acceso)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140909), 'AdminRoot3');

---CURSO---

INSERT INTO curso (id_instructor, nombre, duracion, total_horas, cupo_maximo, anio, periodo, fecha_inicio, fecha_termino, dias_semana, horario, id_tipo_curso)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140905), 'IA Aplicada', 30, 30, 25, 26, 1, TO_DATE('15/08/2026 00:00:00', 'DD/MM/YYYY HH24:MI:SS'), TO_DATE('15/12/2026 00:00:00', 'DD/MM/YYYY HH24:MI:SS'), 'Lunes', '16:00 - 18:00', 1);

INSERT INTO curso (id_instructor, nombre, duracion, total_horas, cupo_maximo, anio, periodo, fecha_inicio, fecha_termino, dias_semana, horario, id_tipo_curso)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140906), 'Bases de Datos NoSQL', 20, 20, 20, 26, 1, TO_DATE('15/08/2026 00:00:00', 'DD/MM/YYYY HH24:MI:SS'), TO_DATE('15/11/2026 00:00:00', 'DD/MM/YYYY HH24:MI:SS'), 'Lunes y Miércoles', '10:00 - 12:00', 2);

INSERT INTO curso (id_instructor, nombre, duracion, total_horas, cupo_maximo, anio, periodo, fecha_inicio, fecha_termino, dias_semana, horario, id_tipo_curso)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140905), 'Cloud Security', 40, 40, 15, 26, 2, TO_DATE('01/02/2026 00:00:00', 'DD/MM/YYYY HH24:MI:SS'), TO_DATE('30/06/2026 00:00:00', 'DD/MM/YYYY HH24:MI:SS'), 'Lunes y Viernes', '10:00 - 13:00', 2);

INSERT INTO curso (id_instructor, nombre, duracion, total_horas, cupo_maximo, anio, periodo, fecha_inicio, fecha_termino, dias_semana, horario, id_tipo_curso)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140780), 'Comida Mexicana 1', 40, 40, 35, 26, 1, TO_DATE('15/08/2026 00:00:00', 'DD/MM/YYYY HH24:MI:SS'), TO_DATE('10/12/2026 00:00:00', 'DD/MM/YYYY HH24:MI:SS'), 'Viernes y Sabado', '16:00 - 18:00', 1);

INSERT INTO curso (id_instructor, nombre, duracion, total_horas, cupo_maximo, anio, periodo, fecha_inicio, fecha_termino, dias_semana, horario, id_tipo_curso)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140780), 'Redes computacionales', 2, 2, 25, 26, 2, TO_DATE('05/04/2026, 0:00:00', 'DD/MM/YYYY HH24:MI:SS'), TO_DATE('10/05/2026 00:00:00', 'DD/MM/YYYY HH24:MI:SS'), 'Lunes y Viernes', '10:00 - 13:00', 1);

INSERT INTO curso (id_instructor, nombre, duracion, total_horas, cupo_maximo, anio, periodo, fecha_inicio, fecha_termino, dias_semana, horario, id_tipo_curso)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140780), 'Sistemas programables', 5, 5, 30, 26, 2, TO_DATE('04/05/2026, 0:00:00', 'DD/MM/YYYY HH24:MI:SS'), TO_DATE('16/05/2026, 0:00:00', 'DD/MM/YYYY HH24:MI:SS'), 'Lunes y Viernes', '09:00 - 10:00', 2);

---TEMARIO DEL CURSO---

INSERT INTO tema_curso (id_curso, titulo_tema, horas_duracion) VALUES (1, 'Introducción a tensores', 10);
INSERT INTO tema_curso (id_curso, titulo_tema, horas_duracion) VALUES (1, 'Perceptrón multicapa', 10);
INSERT INTO tema_curso (id_curso, titulo_tema, horas_duracion) VALUES (1, 'Backpropagation', 10);

INSERT INTO tema_curso (id_curso, titulo_tema, horas_duracion) VALUES (2, 'Documentos vs Tablas', 10);
INSERT INTO tema_curso (id_curso, titulo_tema, horas_duracion) VALUES (2, 'Modelado en MongoDB', 10);

INSERT INTO tema_curso (id_curso, titulo_tema, horas_duracion) VALUES (3, 'Políticas de IAM', 20);
INSERT INTO tema_curso (id_curso, titulo_tema, horas_duracion) VALUES (3, 'Cifrado en tránsito y reposo', 20);

INSERT INTO tema_curso (id_curso, titulo_tema, horas_duracion) VALUES (4, 'Tacos', 20);
INSERT INTO tema_curso (id_curso, titulo_tema, horas_duracion) VALUES (4, 'Tamales', 20);

INSERT INTO tema_curso (id_curso, titulo_tema, horas_duracion) VALUES (5, 'Seguridad', 2);

INSERT INTO tema_curso (id_curso, titulo_tema, horas_duracion) VALUES (6, 'PIC18F4550', 3);
INSERT INTO tema_curso (id_curso, titulo_tema, horas_duracion) VALUES (6, 'ATMEGA', 2);

---INSCRIPCION---

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140001), 1, SYSDATE, 0);

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140001), 2, SYSDATE, 0);

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140001), 4, SYSDATE, 0);

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140901), 1, SYSDATE, 0);

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140901), 3, SYSDATE, 0);

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140901), 4, SYSDATE, 0);

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140901), 5, SYSDATE, 0);

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140902), 1, SYSDATE, 0);

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140902), 2, SYSDATE, 0);

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140902), 6, SYSDATE, 0);

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140903), 2, SYSDATE, 0);

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140903), 3, SYSDATE, 0);

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140903), 4, SYSDATE, 0);

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140904), 3, SYSDATE, 0);

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140904), 5, SYSDATE, 0);

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140904), 6, SYSDATE, 0);

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140002), 4, SYSDATE, 0);

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140002), 6, SYSDATE, 0);

---CONSTANCIA---

INSERT INTO constancia (id_inscripcion, fecha_generacion, tipo_formato, url_descarga)
VALUES (
    (SELECT id_inscripcion FROM inscripcion WHERE id_usuario = (SELECT id_usuario FROM usuario WHERE numero_empleado = 21140001) AND id_curso = 1),
    SYSDATE, 'PDF_OFICIAL', 'https://itq.cloud/constancias/folio_001.pdf'
);

INSERT INTO constancia (id_inscripcion, fecha_generacion, tipo_formato, url_descarga)
VALUES (
    (SELECT id_inscripcion FROM inscripcion WHERE id_usuario = (SELECT id_usuario FROM usuario WHERE numero_empleado = 21140001) AND id_curso = 2),
    SYSDATE, 'PDF_OFICIAL', 'https://itq.cloud/constancias/folio_002.pdf'
);

INSERT INTO constancia (id_inscripcion, fecha_generacion, tipo_formato, url_descarga)
VALUES (
    (SELECT id_inscripcion FROM inscripcion WHERE id_usuario = (SELECT id_usuario FROM usuario WHERE numero_empleado = 21140001) AND id_curso = 4),
    SYSDATE, 'PDF_OFICIAL', 'https://itq.cloud/constancias/folio_003.pdf'
);

COMMIT;
