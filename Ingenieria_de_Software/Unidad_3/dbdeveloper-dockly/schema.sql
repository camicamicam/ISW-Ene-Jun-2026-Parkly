--------- TABLAS DE CATALOGO

CREATE TABLE tipo_plaza (
    id_plaza NUMBER GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR2(50) NOT NULL,
	
    CONSTRAINT pk_tipo_plaza PRIMARY KEY (id_plaza),
    CONSTRAINT uq_tipo_plaza_nombre UNIQUE (nombre)
);

CREATE TABLE departamento (
    id_departamento NUMBER GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR2(100) NOT NULL,
    es_academico NUMBER(1) DEFAULT 0 NOT NULL,
	
    CONSTRAINT pk_departamento PRIMARY KEY (id_departamento),
    CONSTRAINT uq_departamento_nombre UNIQUE (nombre),
    CONSTRAINT chk_depto_academico 
    	CHECK (es_academico IN (0, 1))
);

CREATE TABLE tipo_curso (
    id_tipo_curso NUMBER GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR2(30) NOT NULL,
    
    CONSTRAINT pk_tipo_curso PRIMARY KEY (id_tipo_curso),
    CONSTRAINT uq_tipo_curso_nombre UNIQUE (nombre)
);


----------- USUARIO -----------
CREATE TABLE usuario (
    id_usuario NUMBER GENERATED ALWAYS AS IDENTITY,
    numero_empleado NUMBER NOT NULL,
    nombre VARCHAR2(50) NOT NULL,
    apellido_paterno VARCHAR2(50) NOT NULL,
    apellido_materno VARCHAR2(50),
    correo VARCHAR2(100) NOT NULL,
    nivel_acceso NUMBER(1) DEFAULT 0 NOT NULL,

    CONSTRAINT pk_usuario PRIMARY KEY (id_usuario),
    CONSTRAINT uq_usuario_numero UNIQUE (numero_empleado),
    CONSTRAINT chk_nivel_acceso CHECK (nivel_acceso IN (0,1))
);

------------ DOCENTE ---------------

CREATE TABLE docente (
    id_usuario NUMBER NOT NULL,
    id_plaza NUMBER NOT NULL,
    id_departamento NUMBER NOT NULL,

    CONSTRAINT pk_docente PRIMARY KEY (id_usuario),
    CONSTRAINT fk_docente_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),
    CONSTRAINT fk_docente_plaza FOREIGN KEY (id_plaza)
        REFERENCES tipo_plaza(id_plaza),
    CONSTRAINT fk_docente_departamento FOREIGN KEY (id_departamento)
        REFERENCES departamento(id_departamento)
);

------------ ADMINISTRATIVO ---------------

CREATE TABLE administrativo (
    id_usuario NUMBER NOT NULL,
    id_departamento NUMBER NOT NULL,
	
    CONSTRAINT pk_administrativo PRIMARY KEY (id_usuario),
    CONSTRAINT fk_admin_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),
    CONSTRAINT fk_admin_departamento FOREIGN KEY (id_departamento)
        REFERENCES departamento(id_departamento)
);


----------- INSTRUCTOR -----------
CREATE TABLE instructor (
    id_usuario NUMBER NOT NULL,
    password_acceso VARCHAR2(20) NOT NULL,

    CONSTRAINT pk_instructor PRIMARY KEY (id_usuario),
    CONSTRAINT fk_instructor_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
);

------------ ADMINISTRADOR ---------------

CREATE TABLE administrador (
    id_usuario NUMBER NOT NULL,
    password_acceso VARCHAR2(20) NOT NULL,

    CONSTRAINT pk_administrador PRIMARY KEY (id_usuario),
    CONSTRAINT fk_admin2_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
);

----------- CURSO -----------
CREATE TABLE curso (
    id_curso NUMBER GENERATED ALWAYS AS IDENTITY,
    id_instructor NUMBER NOT NULL,
    nombre VARCHAR2(100) NOT NULL,
    duracion NUMBER NOT NULL,
    total_horas NUMBER NOT NULL,
    cupo_maximo NUMBER NOT NULL,
    anio NUMBER(2) NOT NULL,
    periodo NUMBER(1) NOT NULL,
    fecha_inicio   DATE NOT NULL,
    fecha_termino  DATE NOT NULL,
    dias_semana    VARCHAR2(100) NOT NULL,
    horario        VARCHAR2(50) NOT NULL,
    id_tipo_curso NUMBER NOT NULL,

    CONSTRAINT pk_curso PRIMARY KEY (id_curso),
    CONSTRAINT fk_curso_instructor FOREIGN KEY (id_instructor) 
        REFERENCES instructor(id_usuario),
    CONSTRAINT chk_curso_horas CHECK (total_horas > 0 AND total_horas <= 40),
    CONSTRAINT chk_curso_cupo CHECK (cupo_maximo > 0 AND cupo_maximo <= 35),
    CONSTRAINT chk_fechas_curso CHECK (fecha_termino >= fecha_inicio),
    CONSTRAINT chk_periodo CHECK (periodo IN (1,2)),
    CONSTRAINT fk_curso_tipo FOREIGN KEY (id_tipo_curso) 
	REFERENCES tipo_curso(id_tipo_curso)
);

----------- TEMARIO DEL CURSO -----------
CREATE TABLE tema_curso (
    id_tema NUMBER GENERATED ALWAYS AS IDENTITY,
    id_curso NUMBER NOT NULL,
    titulo_tema VARCHAR2(100) NOT NULL,
    horas_duracion NUMBER NOT NULL,

    CONSTRAINT pk_tema PRIMARY KEY (id_tema),
    CONSTRAINT fk_tema_curso FOREIGN KEY (id_curso) 
        REFERENCES curso(id_curso) ON DELETE CASCADE,
    CONSTRAINT chk_tema_horas CHECK (horas_duracion > 0)
);

------------ INSCRIPCION -------------

CREATE TABLE inscripcion (
    id_inscripcion NUMBER GENERATED ALWAYS AS IDENTITY,
    id_usuario NUMBER NOT NULL,
    id_curso NUMBER NOT NULL,
    fecha_inscripcion DATE DEFAULT SYSDATE,
    estado NUMBER(1) DEFAULT 0 NOT NULL,
    horas_completadas NUMBER DEFAULT 0 NOT NULL,

    CONSTRAINT pk_inscripcion PRIMARY KEY (id_inscripcion),
    CONSTRAINT fk_insc_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),
    CONSTRAINT fk_insc_curso FOREIGN KEY (id_curso)
        REFERENCES curso(id_curso),
    CONSTRAINT uq_inscripcion UNIQUE (id_usuario, id_curso),
    CONSTRAINT chk_estado CHECK (estado IN (0,1)),
    CONSTRAINT chk_horas CHECK (horas_completadas >= 0)
);

-------- CONSTANCIA --------------------

CREATE TABLE constancia (
    folio_numero NUMBER GENERATED ALWAYS AS IDENTITY,
    id_inscripcion NUMBER NOT NULL,
    fecha_generacion DATE DEFAULT SYSDATE,
    tipo_formato VARCHAR2(50),
    url_descarga VARCHAR2(200),

    CONSTRAINT pk_constancia PRIMARY KEY (folio_numero),

    CONSTRAINT fk_constancia_insc FOREIGN KEY (id_inscripcion)
        REFERENCES inscripcion(id_inscripcion),

    CONSTRAINT uq_constancia_inscripcion UNIQUE (id_inscripcion)
);


--- VISTAS ---

-- CONSULTAR CATALOGOS --
-- PLAZAS
CREATE OR REPLACE VIEW v_lista_plazas AS
SELECT id_plaza, nombre 
FROM tipo_plaza
ORDER BY nombre ASC;

-- DEPARTAMENTO
-- Vista General
CREATE OR REPLACE VIEW v_lista_departamentos AS
SELECT 
    id_departamento, 
    nombre, 
    es_academico,
    CASE WHEN es_academico = 1 THEN 'Académico' ELSE 'Administrativo/General' END AS tipo_texto
FROM departamento
ORDER BY es_academico DESC, nombre ASC;

-- Vista con solo departamentos academicos para docentes
CREATE OR REPLACE VIEW v_deptos_academicos AS
SELECT id_departamento, nombre
FROM departamento
WHERE es_academico = 1;

-- TIPO_CURSO
CREATE OR REPLACE VIEW v_lista_tipos_curso AS
SELECT id_tipo_curso, nombre 
FROM tipo_curso
ORDER BY nombre ASC;

-- CONSULTAR USUARIOS --
-- USUARIO
-- Vista solo de usuarios en la tabla usuario
CREATE OR REPLACE VIEW v_solo_usuarios AS
SELECT 
    id_usuario,
    numero_empleado,
    nombre || ' ' || apellido_paterno || ' ' || NVL(apellido_materno, '') AS nombre_completo,
    correo,
    nivel_acceso,
    CASE WHEN nivel_acceso = 1 THEN 'Administrador' ELSE 'Usuario General' END AS tipo_acceso
FROM usuario
ORDER BY apellido_paterno ASC;

-- Vista de usuarios junto a sus roles y campos
CREATE OR REPLACE VIEW v_usuarios_roles AS
SELECT 
    u.id_usuario,
    u.numero_empleado,
    u.nombre || ' ' || u.apellido_paterno || ' ' || NVL(u.apellido_materno, '') AS nombre_completo,
    u.correo,
    u.nivel_acceso,
    CASE 
        WHEN ad.id_usuario IS NOT NULL THEN 'ADMINISTRADOR'
        WHEN i.id_usuario IS NOT NULL THEN 'INSTRUCTOR'
        WHEN d.id_usuario IS NOT NULL THEN 'DOCENTE'
        WHEN a.id_usuario IS NOT NULL THEN 'ADMINISTRATIVO'
        ELSE 'USUARIO_SIN_ROL'
    END AS rol,
    NVL(ad.password_acceso, i.password_acceso) AS password_acceso
FROM usuario u
LEFT JOIN administrador ad ON u.id_usuario = ad.id_usuario
LEFT JOIN instructor i ON u.id_usuario = i.id_usuario
LEFT JOIN docente d ON u.id_usuario = d.id_usuario
LEFT JOIN administrativo a ON u.id_usuario = a.id_usuario;

-- DOCENTE
CREATE OR REPLACE VIEW v_docentes AS
SELECT 
    u.id_usuario,
    u.numero_empleado,
    u.nombre || ' ' || u.apellido_paterno AS nombre_docente,
    p.nombre AS plaza,
    d.nombre AS departamento,
    u.correo
FROM docente doc
JOIN usuario u ON doc.id_usuario = u.id_usuario
JOIN tipo_plaza p ON doc.id_plaza = p.id_plaza
JOIN departamento d ON doc.id_departamento = d.id_departamento;

-- ADMINISTRATIVO
CREATE OR REPLACE VIEW v_administrativos AS
SELECT 
    u.id_usuario,
    u.numero_empleado,
    u.nombre || ' ' || u.apellido_paterno AS nombre_empleado,
    d.nombre AS departamento,
    CASE 
        WHEN d.es_academico = 1 THEN 'Académico' 
        ELSE 'General' 
    END AS funcion_area,
    u.correo
FROM administrativo adm
JOIN usuario u ON adm.id_usuario = u.id_usuario
JOIN departamento d ON adm.id_departamento = d.id_departamento;

-- INSTRUCTOR
CREATE OR REPLACE VIEW v_instructores AS
SELECT 
    i.id_usuario,
    u.numero_empleado,
    u.nombre || ' ' || u.apellido_paterno || ' ' || NVL(u.apellido_materno, '') AS nombre_instructor,
    u.correo,
    i.password_acceso
FROM instructor i
JOIN usuario u ON i.id_usuario = u.id_usuario
ORDER BY u.apellido_paterno ASC;

--ADMINISTRADOR
CREATE OR REPLACE VIEW v_administradores AS
SELECT 
    a.id_usuario,
    u.numero_empleado,
    u.nombre || ' ' || u.apellido_paterno AS nombre_admin,
    u.correo,
    a.password_acceso
FROM administrador a
JOIN usuario u ON a.id_usuario = u.id_usuario
ORDER BY u.nombre ASC;

-- CONSULTAR CURSOS --

--CURSO 
-- Vista completa con temas
CREATE OR REPLACE VIEW v_detalle_cursos AS
SELECT 
    c.id_curso,
    c.nombre AS nombre_curso,
    tc_cat.nombre AS tipo_curso, -- Nombre desde el catálogo
    u.nombre || ' ' || u.apellido_paterno || ' ' || NVL(u.apellido_materno, '') AS instructor,
    c.total_horas,
    (SELECT COUNT(*) FROM inscripcion i WHERE i.id_curso = c.id_curso) AS total_inscritos,
    c.cupo_maximo,
    c.anio,
    c.periodo,
    c.fecha_inicio,
    c.fecha_termino,
    c.dias_semana,
    c.horario,
    tc.titulo_tema,
    tc.horas_duracion AS horas_tema
FROM curso c
JOIN usuario u ON c.id_instructor = u.id_usuario
JOIN tipo_curso tc_cat ON c.id_tipo_curso = tc_cat.id_tipo_curso -- Unión con el nuevo catálogo
LEFT JOIN tema_curso tc ON c.id_curso = tc.id_curso;

-- Vista con solo curso resumido
CREATE OR REPLACE VIEW v_cursos_resumen AS
SELECT 
    c.id_curso,
    c.nombre AS curso,
    SUBSTR(u.nombre, 1, 1) || '. ' || u.apellido_paterno AS instructor,
    c.anio || '-' || c.periodo AS ciclo,
    (SELECT COUNT(*) FROM inscripcion i WHERE i.id_curso = c.id_curso) || '/' || c.cupo_maximo AS ocupacion,
    tc.nombre AS tipo
FROM curso c
JOIN usuario u ON c.id_instructor = u.id_usuario
JOIN tipo_curso tc ON c.id_tipo_curso = tc.id_tipo_curso
ORDER BY c.anio DESC, c.periodo DESC;

-- TEMA_CURSO
CREATE OR REPLACE VIEW v_tema_curso AS
SELECT 
    c.id_curso,
    c.nombre AS nombre_curso,
    t.id_tema,
    t.titulo_tema,
    t.horas_duracion,
    -- Horas total del curso
    SUM(t.horas_duracion) OVER (PARTITION BY c.id_curso) AS total_horas_curso
FROM tema_curso t
JOIN curso c ON t.id_curso = c.id_curso
ORDER BY c.nombre ASC, t.id_tema ASC;

-- INSCRIPCIONES
CREATE OR REPLACE VIEW v_inscripciones_detalle AS
SELECT 
    i.id_inscripcion,
    u.id_usuario,
    u.numero_empleado,
    u.nombre || ' ' || u.apellido_paterno || ' ' || NVL(u.apellido_materno, '') AS nombre_completo,
    u.correo AS correo_alumno,
    CASE 
        WHEN d.id_usuario IS NOT NULL THEN 'Docente'
        WHEN a.id_usuario IS NOT NULL THEN 'Administrativo'
        ELSE 'Usuario Sin Rol?'
    END AS rol,
    c.id_curso,
    c.nombre AS nombre_curso,
    tc.nombre AS tipo_curso,
    c.id_instructor,
    i.fecha_inscripcion,
    i.horas_completadas,
    CASE 
        WHEN i.estado = 0 THEN 'Pendiente'
        WHEN i.estado = 1 THEN 'Aprobado'
        ELSE 'Desconocido'
    END AS estatus
FROM inscripcion i
JOIN usuario u ON i.id_usuario = u.id_usuario
JOIN curso c ON i.id_curso = c.id_curso
JOIN tipo_curso tc ON c.id_tipo_curso = tc.id_tipo_curso
LEFT JOIN docente d ON u.id_usuario = d.id_usuario
LEFT JOIN administrativo a ON u.id_usuario = a.id_usuario;

-- CONSTANCIA
CREATE OR REPLACE VIEW v_reporte_constancias AS
SELECT 
    con.folio_numero AS folio,
    u.nombre || ' ' || u.apellido_paterno AS graduado,
    c.nombre AS curso_completado,
    con.fecha_generacion,
    con.tipo_formato,
    con.url_descarga,
    c.anio || '-' || c.periodo AS ciclo_escolar
FROM constancia con
JOIN inscripcion ins ON con.id_inscripcion = ins.id_inscripcion
JOIN usuario u ON ins.id_usuario = u.id_usuario
JOIN curso c ON ins.id_curso = c.id_curso
ORDER BY con.fecha_generacion DESC;