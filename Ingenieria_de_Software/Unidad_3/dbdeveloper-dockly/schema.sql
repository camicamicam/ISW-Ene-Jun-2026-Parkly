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
    CONSTRAINT uq_usuario_correo UNIQUE (correo),
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
        REFERENCES tipo_plaza(id_plaza)
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
    fecha_inicio   DATE NOT NULL,
    fecha_termino  DATE NOT NULL,
    dias_semana    VARCHAR2(100) NOT NULL,
    horario        VARCHAR2(50) NOT NULL,
    anio NUMBER(2) NOT NULL,
    periodo NUMBER(1) NOT NULL,
    id_tipo_curso NUMBER NOT NULL

    CONSTRAINT pk_curso PRIMARY KEY (id_curso),
    CONSTRAINT fk_curso_instructor FOREIGN KEY (id_instructor) 
        REFERENCES instructor(id_usuario),
    CONSTRAINT chk_curso_horas CHECK (total_horas > 0 AND total_horas <= 40),
    CONSTRAINT chk_curso_cupo CHECK (cupo_maximo > 0 AND cupo_maximo <= 35),
    CONSTRAINT chk_fechas_curso CHECK (fecha_termino >= fecha_inicio);
    CONSTRAINT chk_periodo CHECK (periodo IN (1,2)),
    CONSTRAINT fk_curso_tipo FOREIGN KEY (id_tipo_curso) 
	REFERENCES tipo_curso(id_tipo_curso);
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


---VISTAS---
--CONSULTAR USUARIOS

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

--CONSULTAR CURSOS
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
