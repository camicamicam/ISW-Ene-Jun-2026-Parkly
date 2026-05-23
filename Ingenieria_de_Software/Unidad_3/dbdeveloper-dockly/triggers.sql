-- BITACORA --
-- TIPO_PLAZA
CREATE TABLE bitacora_tipo_plaza (
    id_bitacora       NUMBER GENERATED ALWAYS AS IDENTITY,
    id_plaza_afec     NUMBER, 
    nombre_plaza      VARCHAR2(100),
    accion_bitacora   CHAR(1), -- A, B, C
    usuario_bitacora  VARCHAR2(50), 
    fecha_bitacora    DATE DEFAULT SYSDATE,

    CONSTRAINT pk_bit_tipo_plaza PRIMARY KEY (id_bitacora),
    CONSTRAINT chk_accion_plaza CHECK (accion_bitacora IN ('A', 'B', 'C'))
);

CREATE OR REPLACE TRIGGER trg_bit_tipo_plaza
AFTER INSERT OR UPDATE OR DELETE ON tipo_plaza
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO bitacora_tipo_plaza (id_plaza_afec, nombre_plaza, accion_bitacora, usuario_bitacora)
        VALUES (:NEW.id_plaza, :NEW.nombre, 'A', USER);
        
    ELSIF UPDATING THEN
        INSERT INTO bitacora_tipo_plaza (id_plaza_afec, nombre_plaza, accion_bitacora, usuario_bitacora)
        VALUES (:OLD.id_plaza, :OLD.nombre, 'C', USER);
        
    ELSIF DELETING THEN
        INSERT INTO bitacora_tipo_plaza (id_plaza_afec, nombre_plaza, accion_bitacora, usuario_bitacora)
        VALUES (:OLD.id_plaza, :OLD.nombre, 'B', USER);
    END IF;
END;
/

-- TIPO_DEPARTAMENTO
CREATE TABLE bitacora_departamento (
    id_bitacora        NUMBER GENERATED ALWAYS AS IDENTITY,
    id_depto_afec      NUMBER, 
    nombre_depto       VARCHAR2(100),
    es_academico       NUMBER(1),
    accion_bitacora    CHAR(1), 
    usuario_bitacora   VARCHAR2(50), 
    fecha_bitacora     DATE DEFAULT SYSDATE,

    CONSTRAINT pk_bit_departamento PRIMARY KEY (id_bitacora),
    CONSTRAINT chk_accion_depto CHECK (accion_bitacora IN ('A', 'B', 'C'))
);

CREATE OR REPLACE TRIGGER trg_bit_departamento
AFTER INSERT OR UPDATE OR DELETE ON departamento
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO bitacora_departamento (id_depto_afec, nombre_depto, es_academico, accion_bitacora, usuario_bitacora)
        VALUES (:NEW.id_departamento, :NEW.nombre, :NEW.es_academico, 'A', USER);
        
    ELSIF UPDATING THEN
        INSERT INTO bitacora_departamento (id_depto_afec, nombre_depto, es_academico, accion_bitacora, usuario_bitacora)
        VALUES (:OLD.id_departamento, :OLD.nombre, :OLD.es_academico, 'C', USER);
        
    ELSIF DELETING THEN
        INSERT INTO bitacora_departamento (id_depto_afec, nombre_depto, es_academico, accion_bitacora, usuario_bitacora)
        VALUES (:OLD.id_departamento, :OLD.nombre, :OLD.es_academico, 'B', USER);
    END IF;
END;
/

-- TIPO_CURSO
CREATE TABLE bitacora_tipo_curso (
    id_bitacora        NUMBER GENERATED ALWAYS AS IDENTITY,
    id_tipo_afec       NUMBER, 
    nombre_tipo        VARCHAR2(100),
    accion_bitacora    CHAR(1), -- A, B, C
    usuario_bitacora   VARCHAR2(50), 
    fecha_bitacora     DATE DEFAULT SYSDATE,

    CONSTRAINT pk_bit_tipo_curso PRIMARY KEY (id_bitacora),
    CONSTRAINT chk_accion_tipo_c CHECK (accion_bitacora IN ('A', 'B', 'C'))
);

CREATE OR REPLACE TRIGGER trg_bit_tipo_curso
AFTER INSERT OR UPDATE OR DELETE ON tipo_curso
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO bitacora_tipo_curso (id_tipo_afec, nombre_tipo, accion_bitacora, usuario_bitacora)
        VALUES (:NEW.id_tipo_curso, :NEW.nombre, 'A', USER);
        
    ELSIF UPDATING THEN
        INSERT INTO bitacora_tipo_curso (id_tipo_afec, nombre_tipo, accion_bitacora, usuario_bitacora)
        VALUES (:OLD.id_tipo_curso, :OLD.nombre, 'C', USER);
        
    ELSIF DELETING THEN
        INSERT INTO bitacora_tipo_curso (id_tipo_afec, nombre_tipo, accion_bitacora, usuario_bitacora)
        VALUES (:OLD.id_tipo_curso, :OLD.nombre, 'B', USER);
    END IF;
END;
/

-- USUARIO
CREATE TABLE bitacora_usuario (
    id_bitacora        NUMBER GENERATED ALWAYS AS IDENTITY,
    id_usuario_afec    NUMBER, 
    numero_empleado    VARCHAR2(20),
    nombre             VARCHAR2(50),
    ap_paterno         VARCHAR2(50),
    ap_materno         VARCHAR2(50),
    correo             VARCHAR2(100),
    nivel_acceso       NUMBER(1),
    accion_bitacora    CHAR(1), -- A, B, C
    usuario_bitacora   VARCHAR2(50), 
    fecha_bitacora     DATE DEFAULT SYSDATE,

    CONSTRAINT pk_bit_usuario PRIMARY KEY (id_bitacora),
    CONSTRAINT chk_accion_usuario CHECK (accion_bitacora IN ('A', 'B', 'C'))
);

CREATE OR REPLACE TRIGGER trg_bit_usuario
AFTER INSERT OR UPDATE OR DELETE ON usuario
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO bitacora_usuario (
            id_usuario_afec, numero_empleado, nombre, ap_paterno, ap_materno, 
            correo, nivel_acceso, accion_bitacora, usuario_bitacora
        )
        VALUES (
            :NEW.id_usuario, :NEW.numero_empleado, :NEW.nombre, :NEW.apellido_paterno, :NEW.apellido_materno, 
            :NEW.correo, :NEW.nivel_acceso, 'A', USER
        );
        
    ELSIF UPDATING THEN
        INSERT INTO bitacora_usuario (
            id_usuario_afec, numero_empleado, nombre, ap_paterno, ap_materno, 
            correo, nivel_acceso, accion_bitacora, usuario_bitacora
        )
        VALUES (
            :OLD.id_usuario, :OLD.numero_empleado, :OLD.nombre, :OLD.apellido_paterno, :OLD.apellido_materno, 
            :OLD.correo, :OLD.nivel_acceso, 'C', USER
        );
        
    ELSIF DELETING THEN
        INSERT INTO bitacora_usuario (
            id_usuario_afec, numero_empleado, nombre, ap_paterno, ap_materno, 
            correo, nivel_acceso, accion_bitacora, usuario_bitacora
        )
        VALUES (
            :OLD.id_usuario, :OLD.numero_empleado, :OLD.nombre, :OLD.apellido_paterno, :OLD.apellido_materno, 
            :OLD.correo, :OLD.nivel_acceso, 'B', USER
        );
    END IF;
END;
/

-- DOCENTE
CREATE TABLE bitacora_docente (
    id_bitacora        NUMBER GENERATED ALWAYS AS IDENTITY,
    id_usuario_afec    NUMBER, -- El ID del docente
    id_plaza_afec      NUMBER, 
    id_depto_afec      NUMBER,
    accion_bitacora    CHAR(1), -- A, B, C
    usuario_bitacora   VARCHAR2(50), 
    fecha_bitacora     DATE DEFAULT SYSDATE,

    CONSTRAINT pk_bit_docente PRIMARY KEY (id_bitacora),
    CONSTRAINT chk_accion_docente CHECK (accion_bitacora IN ('A', 'B', 'C'))
);

CREATE OR REPLACE TRIGGER trg_bit_docente
AFTER INSERT OR UPDATE OR DELETE ON docente
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO bitacora_docente (id_usuario_afec, id_plaza_afec, id_depto_afec, accion_bitacora, usuario_bitacora)
        VALUES (:NEW.id_usuario, :NEW.id_plaza, :NEW.id_departamento, 'A', USER);
        
    ELSIF UPDATING THEN
        -- Guardamos los datos previos al cambio para ver la evolución del docente
        INSERT INTO bitacora_docente (id_usuario_afec, id_plaza_afec, id_depto_afec, accion_bitacora, usuario_bitacora)
        VALUES (:OLD.id_usuario, :OLD.id_plaza, :OLD.id_departamento, 'C', USER);
        
    ELSIF DELETING THEN
        INSERT INTO bitacora_docente (id_usuario_afec, id_plaza_afec, id_depto_afec, accion_bitacora, usuario_bitacora)
        VALUES (:OLD.id_usuario, :OLD.id_plaza, :OLD.id_departamento, 'B', USER);
    END IF;
END;
/

-- ADMINISTRATIVO
CREATE TABLE bitacora_administrativo (
    id_bitacora        NUMBER GENERATED ALWAYS AS IDENTITY,
    id_usuario_afec    NUMBER, -- El ID del administrativo
    id_depto_afec      NUMBER,
    accion_bitacora    CHAR(1), -- A, B, C
    usuario_bitacora   VARCHAR2(50), 
    fecha_bitacora     DATE DEFAULT SYSDATE,

    CONSTRAINT pk_bit_administrativo PRIMARY KEY (id_bitacora),
    CONSTRAINT chk_accion_admin CHECK (accion_bitacora IN ('A', 'B', 'C'))
);

CREATE OR REPLACE TRIGGER trg_bit_administrativo
AFTER INSERT OR UPDATE OR DELETE ON administrativo
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO bitacora_administrativo (id_usuario_afec, id_depto_afec, accion_bitacora, usuario_bitacora)
        VALUES (:NEW.id_usuario, :NEW.id_departamento, 'A', USER);
        
    ELSIF UPDATING THEN
        INSERT INTO bitacora_administrativo (id_usuario_afec, id_depto_afec, accion_bitacora, usuario_bitacora)
        VALUES (:OLD.id_usuario, :OLD.id_departamento, 'C', USER);
        
    ELSIF DELETING THEN
        INSERT INTO bitacora_administrativo (id_usuario_afec, id_depto_afec, accion_bitacora, usuario_bitacora)
        VALUES (:OLD.id_usuario, :OLD.id_departamento, 'B', USER);
    END IF;
END;
/

-- INSTRUCTOR
CREATE TABLE bitacora_instructor (
    id_bitacora        NUMBER GENERATED ALWAYS AS IDENTITY,
    id_usuario_afec    NUMBER, -- ID del usuario que es instructor
    accion_bitacora    CHAR(1), -- A, B, C
    usuario_bitacora   VARCHAR2(50), 
    fecha_bitacora     DATE DEFAULT SYSDATE,

    CONSTRAINT pk_bit_instructor PRIMARY KEY (id_bitacora),
    CONSTRAINT chk_accion_inst CHECK (accion_bitacora IN ('A', 'B', 'C'))
);

CREATE OR REPLACE TRIGGER trg_bit_instructor
AFTER INSERT OR UPDATE OR DELETE ON instructor
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO bitacora_instructor (id_usuario_afec, accion_bitacora, usuario_bitacora)
        VALUES (:NEW.id_usuario, 'A', USER);
        
    ELSIF UPDATING THEN
        -- Se detecta si se cambió el password o el ID, pero solo registramos el hecho
        INSERT INTO bitacora_instructor (id_usuario_afec, accion_bitacora, usuario_bitacora)
        VALUES (:OLD.id_usuario, 'C', USER);
        
    ELSIF DELETING THEN
        INSERT INTO bitacora_instructor (id_usuario_afec, accion_bitacora, usuario_bitacora)
        VALUES (:OLD.id_usuario, 'B', USER);
    END IF;
END;
/

-- ADMINISTRADOR
CREATE TABLE bitacora_administrador (
    id_bitacora        NUMBER GENERATED ALWAYS AS IDENTITY,
    id_usuario_afec    NUMBER, -- ID del usuario con rol de administrador
    accion_bitacora    CHAR(1), -- A, B, C
    usuario_bitacora   VARCHAR2(50), 
    fecha_bitacora     DATE DEFAULT SYSDATE,

    CONSTRAINT pk_bit_administrador PRIMARY KEY (id_bitacora),
    CONSTRAINT chk_accion_admin_sist CHECK (accion_bitacora IN ('A', 'B', 'C'))
);

CREATE OR REPLACE TRIGGER trg_bit_administrador
AFTER INSERT OR UPDATE OR DELETE ON administrador
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO bitacora_administrador (id_usuario_afec, accion_bitacora, usuario_bitacora)
        VALUES (:NEW.id_usuario, 'A', USER);
        
    ELSIF UPDATING THEN
        INSERT INTO bitacora_administrador (id_usuario_afec, accion_bitacora, usuario_bitacora)
        VALUES (:OLD.id_usuario, 'C', USER);
        
    ELSIF DELETING THEN
        INSERT INTO bitacora_administrador (id_usuario_afec, accion_bitacora, usuario_bitacora)
        VALUES (:OLD.id_usuario, 'B', USER);
    END IF;
END;
/

-- CURSO
CREATE TABLE bitacora_curso (
    id_bitacora        NUMBER GENERATED ALWAYS AS IDENTITY,
    id_curso_afec      NUMBER, 
    nombre_curso       VARCHAR2(100),
    anio               NUMBER(4),
    periodo            NUMBER(1),
    cupo_maximo        NUMBER(3),
    id_instructor      NUMBER,
    id_tipo            NUMBER,
    accion_bitacora    CHAR(1), -- A, B, C
    usuario_bitacora   VARCHAR2(50), 
    fecha_bitacora     DATE DEFAULT SYSDATE,

    CONSTRAINT pk_bit_curso PRIMARY KEY (id_bitacora),
    CONSTRAINT chk_accion_curso CHECK (accion_bitacora IN ('A', 'B', 'C'))
);

CREATE OR REPLACE TRIGGER trg_bit_curso
AFTER INSERT OR UPDATE OR DELETE ON curso
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO bitacora_curso (
            id_curso_afec, nombre_curso, anio, periodo, cupo_maximo, 
            id_instructor, id_tipo, accion_bitacora, usuario_bitacora
        )
        VALUES (
            :NEW.id_curso, :NEW.nombre, :NEW.anio, :NEW.periodo, :NEW.cupo_maximo, 
            :NEW.id_instructor, :NEW.id_tipo_curso, 'A', USER
        );
        
    ELSIF UPDATING THEN
        INSERT INTO bitacora_curso (
            id_curso_afec, nombre_curso, anio, periodo, cupo_maximo, 
            id_instructor, id_tipo, accion_bitacora, usuario_bitacora
        )
        VALUES (
            :OLD.id_curso, :OLD.nombre, :OLD.anio, :OLD.periodo, :OLD.cupo_maximo, 
            :OLD.id_instructor, :OLD.id_tipo_curso, 'C', USER
        );
        
    ELSIF DELETING THEN
        INSERT INTO bitacora_curso (
            id_curso_afec, nombre_curso, anio, periodo, cupo_maximo, 
            id_instructor, id_tipo, accion_bitacora, usuario_bitacora
        )
        VALUES (
            :OLD.id_curso, :OLD.nombre, :OLD.anio, :OLD.periodo, :OLD.cupo_maximo, 
            :OLD.id_instructor, :OLD.id_tipo_curso, 'B', USER
        );
    END IF;
END;
/

-- TEMA_CURSO
CREATE TABLE bitacora_tema_curso (
    id_bitacora        NUMBER GENERATED ALWAYS AS IDENTITY,
    id_tema_afec       NUMBER, 
    id_curso           NUMBER, 
    titulo_tema        VARCHAR2(100),
    horas_duracion     NUMBER,
    accion_bitacora    CHAR(1), -- A, B, C
    usuario_bitacora   VARCHAR2(50), 
    fecha_bitacora     DATE DEFAULT SYSDATE,

    CONSTRAINT pk_bit_tema_curso PRIMARY KEY (id_bitacora),
    CONSTRAINT chk_accion_tema_c CHECK (accion_bitacora IN ('A', 'B', 'C'))
);

CREATE OR REPLACE TRIGGER trg_bit_tema_curso
AFTER INSERT OR UPDATE OR DELETE ON tema_curso
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO bitacora_tema_curso (
            id_tema_afec, id_curso, titulo_tema, horas_duracion, 
            accion_bitacora, usuario_bitacora
        )
        VALUES (
            :NEW.id_tema, :NEW.id_curso, :NEW.titulo_tema, :NEW.horas_duracion, 
            'A', USER
        );
        
    ELSIF UPDATING THEN
        INSERT INTO bitacora_tema_curso (
            id_tema_afec, id_curso, titulo_tema, horas_duracion, 
            accion_bitacora, usuario_bitacora
        )
        VALUES (
            :OLD.id_tema, :OLD.id_curso, :OLD.titulo_tema, :OLD.horas_duracion, 
            'C', USER
        );
        
    ELSIF DELETING THEN
        INSERT INTO bitacora_tema_curso (
            id_tema_afec, id_curso, titulo_tema, horas_duracion, 
            accion_bitacora, usuario_bitacora
        )
        VALUES (
            :OLD.id_tema, :OLD.id_curso, :OLD.titulo_tema, :OLD.horas_duracion, 
            'B', USER
        );
    END IF;
END;
/

-- INSCRIPCION
CREATE TABLE bitacora_inscripcion (
    id_bitacora        NUMBER GENERATED ALWAYS AS IDENTITY,
    id_inscripcion_afec NUMBER, 
    id_usuario         NUMBER,
    id_curso           NUMBER,
    fecha_inscripcion  DATE,
    estado             NUMBER(1),
    accion_bitacora    CHAR(1), -- A, B, C
    usuario_bitacora   VARCHAR2(50), 
    fecha_bitacora     DATE DEFAULT SYSDATE,

    CONSTRAINT pk_bit_inscripcion PRIMARY KEY (id_bitacora),
    CONSTRAINT chk_accion_insc_b CHECK (accion_bitacora IN ('A', 'B', 'C'))
);

CREATE OR REPLACE TRIGGER trg_bit_inscripcion
AFTER INSERT OR UPDATE OR DELETE ON inscripcion
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO bitacora_inscripcion (
            id_inscripcion_afec, id_usuario, id_curso, fecha_inscripcion, 
            estado, accion_bitacora, usuario_bitacora
        )
        VALUES (
            :NEW.id_inscripcion, :NEW.id_usuario, :NEW.id_curso, :NEW.fecha_inscripcion, 
            :NEW.estado, 'A', USER
        );
        
    ELSIF UPDATING THEN
        INSERT INTO bitacora_inscripcion (
            id_inscripcion_afec, id_usuario, id_curso, fecha_inscripcion, 
            estado, accion_bitacora, usuario_bitacora
        )
        VALUES (
            :OLD.id_inscripcion, :OLD.id_usuario, :OLD.id_curso, :OLD.fecha_inscripcion, 
            :OLD.estado, 'C', USER
        );
        
    ELSIF DELETING THEN
        INSERT INTO bitacora_inscripcion (
            id_inscripcion_afec, id_usuario, id_curso, fecha_inscripcion, 
            estado, accion_bitacora, usuario_bitacora
        )
        VALUES (
            :OLD.id_inscripcion, :OLD.id_usuario, :OLD.id_curso, :OLD.fecha_inscripcion, 
            :OLD.estado, 'B', USER
        );
    END IF;
END;
/

-- CONSTANCIA
CREATE TABLE bitacora_constancia (
    id_bitacora        NUMBER GENERATED ALWAYS AS IDENTITY,
    folio_afec         NUMBER,
    id_inscripcion     NUMBER,
    tipo_formato       VARCHAR2(50),
    url_descarga       VARCHAR2(200),
    accion_bitacora    CHAR(1), -- A, B, C
    usuario_bitacora   VARCHAR2(50), 
    fecha_bitacora     DATE DEFAULT SYSDATE,

    CONSTRAINT pk_bit_constancia PRIMARY KEY (id_bitacora),
    CONSTRAINT chk_accion_const CHECK (accion_bitacora IN ('A', 'B', 'C'))
);

CREATE OR REPLACE TRIGGER trg_bit_constancia
AFTER INSERT OR UPDATE OR DELETE ON constancia
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO bitacora_constancia (
            folio_afec, id_inscripcion, tipo_formato, url_descarga, 
            accion_bitacora, usuario_bitacora
        )
        VALUES (
            :NEW.folio_numero, :NEW.id_inscripcion, :NEW.tipo_formato, :NEW.url_descarga, 
            'A', USER
        );
        
    ELSIF UPDATING THEN
        INSERT INTO bitacora_constancia (
            folio_afec, id_inscripcion, tipo_formato, url_descarga, 
            accion_bitacora, usuario_bitacora
        )
        VALUES (
            :OLD.folio_numero, :OLD.id_inscripcion, :OLD.tipo_formato, :OLD.url_descarga, 
            'C', USER
        );
        
    ELSIF DELETING THEN
        INSERT INTO bitacora_constancia (
            folio_afec, id_inscripcion, tipo_formato, url_descarga, 
            accion_bitacora, usuario_bitacora
        )
        VALUES (
            :OLD.folio_numero, :OLD.id_inscripcion, :OLD.tipo_formato, :OLD.url_descarga, 
            'B', USER
        );
    END IF;
END;
/