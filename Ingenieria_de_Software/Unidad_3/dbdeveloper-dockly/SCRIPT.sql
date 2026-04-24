--------- TABLAS DE CATALOGO

CREATE TABLE tipo_plaza (
    id_plaza NUMBER,
    nombre VARCHAR2(50) NOT NULL,
	
    CONSTRAINT pk_tipo_plaza PRIMARY KEY (id_plaza),
    CONSTRAINT uq_tipo_plaza_nombre UNIQUE (nombre)
);

CREATE TABLE departamento (
    id_departamento NUMBER,
    nombre VARCHAR2(100) NOT NULL,
	
    CONSTRAINT pk_departamento PRIMARY KEY (id_departamento),
    CONSTRAINT uq_departamento_nombre UNIQUE (nombre)
);

----------- USUARIO -----------
CREATE TABLE usuario (
    id_usuario NUMBER,
    numero_empleado NUMBER NOT NULL,
    nombre VARCHAR2(50) NOT NULL,
    apellido_paterno VARCHAR2(50) NOT NULL,
    apellido_materno VARCHAR2(50),
    correo VARCHAR2(100) NOT NULL,
    nivel_acceso NUMBER(1) DEFAULT 0 NOT NULL,

    CONSTRAINT pk_usuario PRIMARY KEY (id_usuario),
    CONSTRAINT uq_usuario_numero UNIQUE (numero_empleado),
    CONSTRAINT uq_usuario_correo UNIQUE (correo),
    CONSTRAINT chk_correo_institucional CHECK (correo LIKE '%@queretaro.tecnm.mx'),
    CONSTRAINT chk_nivel_acceso CHECK (nivel_acceso IN (0,1))
);


----------- SECUENCIA Y TRIGGER PARA ID_USUARIO -----------
CREATE SEQUENCE seq_usuario START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER trg_id_usuario
BEFORE INSERT ON usuario
FOR EACH ROW
BEGIN
  SELECT seq_usuario.NEXTVAL INTO :NEW.id_usuario FROM dual;
END;
/

------------ DOCENTE ---------------

CREATE TABLE docente (
    id_usuario NUMBER NOT NULL,
    id_plaza NUMBER NOT NULL,

    CONSTRAINT pk_docente PRIMARY KEY (id_usuario),
    CONSTRAINT fk_docente_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),
    CONSTRAINT fk_docente_plaza FOREIGN KEY (id_plaza)
        REFERENCES tipo_plaza(id_plaza)
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
    id_curso NUMBER,
    nombre VARCHAR2(100) NOT NULL,
    descripcion VARCHAR2(300),
    duracion NUMBER NOT NULL,
    total_horas NUMBER NOT NULL,
    cupo_maximo NUMBER NOT NULL,

    anio NUMBER(2) NOT NULL,
    periodo NUMBER(1) NOT NULL,

    CONSTRAINT pk_curso PRIMARY KEY (id_curso),

    CONSTRAINT chk_curso_horas CHECK (total_horas > 0 AND total_horas <= 40),
    CONSTRAINT chk_curso_cupo CHECK (cupo_maximo > 0 AND cupo_maximo <= 35),
    CONSTRAINT chk_periodo CHECK (periodo IN (1,2))
);

CREATE SEQUENCE seq_curso START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER trg_id_curso
BEFORE INSERT ON curso
FOR EACH ROW
BEGIN
  SELECT seq_curso.NEXTVAL INTO :NEW.id_curso FROM dual;
END;
/

------------ INSCRIPCION -------------

CREATE TABLE inscripcion (
    id_inscripcion NUMBER,
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

CREATE SEQUENCE seq_inscripcion START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER trg_id_inscripcion
BEFORE INSERT ON inscripcion
FOR EACH ROW
BEGIN
  SELECT seq_inscripcion.NEXTVAL INTO :NEW.id_inscripcion FROM dual;
END;
/

-------- CONSTANCIA --------------------

CREATE TABLE constancia (
    folio_numero NUMBER,
    id_inscripcion NUMBER NOT NULL,
    fecha_generacion DATE DEFAULT SYSDATE,
    tipo_formato VARCHAR2(50),
    url_descarga VARCHAR2(200),

    CONSTRAINT pk_constancia PRIMARY KEY (folio_numero),

    CONSTRAINT fk_constancia_insc FOREIGN KEY (id_inscripcion)
        REFERENCES inscripcion(id_inscripcion),

    CONSTRAINT uq_constancia_inscripcion UNIQUE (id_inscripcion)
);

CREATE SEQUENCE seq_constancia START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER trg_id_constancia
BEFORE INSERT ON constancia
FOR EACH ROW
BEGIN
  SELECT seq_constancia.NEXTVAL INTO :NEW.folio_numero FROM dual;
END;
/