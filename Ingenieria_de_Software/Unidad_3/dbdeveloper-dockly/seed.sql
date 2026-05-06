---PLAZAS---
INSERT INTO tipo_plaza (nombre) VALUES ('Plaza de Tiempo Completo');
INSERT INTO tipo_plaza (nombre) VALUES ('Plaza de Medio Tiempo');
INSERT INTO tipo_plaza (nombre) VALUES ('Plaza por Honorarios');

---DEPARTAMENTO---
INSERT INTO departamento (nombre) VALUES ('Ciencias Básicas');
INSERT INTO departamento (nombre) VALUES ('Ciencias Económico Administrativas');
INSERT INTO departamento (nombre) VALUES ('Desarrollo Académico');
INSERT INTO departamento (nombre) VALUES ('División de Estudios Profesionales');
INSERT INTO departamento (nombre) VALUES ('División Posgrado e Investigación');
INSERT INTO departamento (nombre) VALUES ('Ingeniería Eléctrica y Electrónica');
INSERT INTO departamento (nombre) VALUES ('Ingeniería Industrial');
INSERT INTO departamento (nombre) VALUES ('Metal Mecánica');
INSERT INTO departamento (nombre) VALUES ('Sistemas y Computación');

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
VALUES (21140904, 'Lucía', 'Fernández', NULL, 'lucia.fernandez@queretaro.tecnm.mx', 0);

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

---DOCENTE---
INSERT INTO docente (id_usuario, id_plaza)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140001), 1);

INSERT INTO docente (id_usuario, id_plaza)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140901), 1);

INSERT INTO docente (id_usuario, id_plaza)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140902), 2);

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

---ADMINISTRADOR---

INSERT INTO administrador (id_usuario, password_acceso)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140907), 'AdminRoot1');

INSERT INTO administrador (id_usuario, password_acceso)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140908), 'AdminRoot2');

INSERT INTO administrador (id_usuario, password_acceso)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140909), 'AdminRoot3');

---CURSO---

INSERT INTO curso (id_instructor, nombre, descripcion, duracion, total_horas, cupo_maximo, anio, periodo)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140905), 
        'IA Aplicada', 'Fundamentos de Redes Neuronales', 4, 30, 25, 26, 1);

INSERT INTO curso (id_instructor, nombre, descripcion, duracion, total_horas, cupo_maximo, anio, periodo)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140906), 
        'Bases de Datos NoSQL', 'MongoDB y Cassandra para Big Data', 3, 20, 20, 26, 1);

INSERT INTO curso (id_instructor, nombre, descripcion, duracion, total_horas, cupo_maximo, anio, periodo)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140905), 
        'Cloud Security', 'Seguridad avanzada en OCI y AWS', 5, 40, 15, 26, 2);

---TEMARIO DEL CURSO---

INSERT INTO tema_curso (id_curso, titulo_tema, horas_duracion) VALUES (1, 'Introducción a tensores', 10);
INSERT INTO tema_curso (id_curso, titulo_tema, horas_duracion) VALUES (1, 'Perceptrón multicapa', 10);
INSERT INTO tema_curso (id_curso, titulo_tema, horas_duracion) VALUES (1, 'Backpropagation', 10);

INSERT INTO tema_curso (id_curso, titulo_tema, horas_duracion) VALUES (2, 'Documentos vs Tablas', 10);
INSERT INTO tema_curso (id_curso, titulo_tema, horas_duracion) VALUES (2, 'Modelado en MongoDB', 10);

INSERT INTO tema_curso (id_curso, titulo_tema, horas_duracion) VALUES (3, 'Políticas de IAM', 20);
INSERT INTO tema_curso (id_curso, titulo_tema, horas_duracion) VALUES (3, 'Cifrado en tránsito y reposo', 20);

---INSCRIPCION---

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140001), 1, SYSDATE, 0);

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140002), 2, SYSDATE, 0);

INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
VALUES ((SELECT id_usuario FROM usuario WHERE numero_empleado = 21140903), 1, SYSDATE, 0);

---CONSTANCIA---

INSERT INTO constancia (id_inscripcion, fecha_generacion, tipo_formato, url_descarga)
VALUES (1, SYSDATE, 'PDF_OFICIAL', 'https://itq.cloud/constancias/folio_001.pdf');

INSERT INTO constancia (id_inscripcion, fecha_generacion, tipo_formato, url_descarga)
VALUES (2, SYSDATE, 'PDF_OFICIAL', 'https://itq.cloud/constancias/folio_002.pdf');

INSERT INTO constancia (id_inscripcion, fecha_generacion, tipo_formato, url_descarga)
VALUES (3, SYSDATE, 'PDF_OFICIAL', 'https://itq.cloud/constancias/folio_003.pdf');
