--- PLAZAS ---
-- CREATE
CREATE OR REPLACE PROCEDURE insertar_plaza (
    p_nombre IN tipo_plaza.nombre%TYPE
) IS
BEGIN
    INSERT INTO tipo_plaza (nombre) VALUES (p_nombre);
    COMMIT;
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        RAISE_APPLICATION_ERROR(-20030, 'Error: Ya existe una plaza con ese nombre.');
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20031, 'Error al insertar: ' || SQLERRM);
END;
/
-- UPDATE
CREATE OR REPLACE PROCEDURE actualizar_plaza (
    p_id_plaza IN tipo_plaza.id_plaza%TYPE,
    p_nombre   IN tipo_plaza.nombre%TYPE
) IS
BEGIN
    UPDATE tipo_plaza 
    SET nombre = p_nombre 
    WHERE id_plaza = p_id_plaza;
    
    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20032, 'Error: No se encontró la plaza con ID ' || p_id_plaza);
    END IF;
    COMMIT;
END;
/
-- DELETE
CREATE OR REPLACE PROCEDURE eliminar_plaza (
    p_id_plaza IN tipo_plaza.id_plaza%TYPE
) IS
BEGIN
    DELETE FROM tipo_plaza WHERE id_plaza = p_id_plaza;
    
    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20032, 'Error: No se encontró la plaza con ID ' || p_id_plaza);
    END IF;
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        -- No se borrará la plaza si tiene al menos un docente asignado.
        RAISE_APPLICATION_ERROR(-20033, 'No se puede eliminar la plaza porque hay docentes que la utilizan.');
END;
/

--- DEPARTAMENTOS ---
-- CREATE
CREATE OR REPLACE PROCEDURE insertar_departamento (
    p_nombre       IN departamento.nombre%TYPE,
    p_es_academico IN departamento.es_academico%TYPE -- 0 o 1
) IS
BEGIN
    INSERT INTO departamento (nombre, es_academico) 
    VALUES (p_nombre, p_es_academico);
    COMMIT;
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        RAISE_APPLICATION_ERROR(-20040, 'Error: Ya existe un departamento con el nombre: ' || p_nombre);
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20041, 'Error inesperado al insertar departamento: ' || SQLERRM);
END;
/
-- UPDATE
CREATE OR REPLACE PROCEDURE actualizar_departamento (
    p_id_depto     IN departamento.id_departamento%TYPE,
    p_nombre       IN departamento.nombre%TYPE,
    p_es_academico IN departamento.es_academico%TYPE
) IS
BEGIN
    UPDATE departamento 
    SET nombre = p_nombre,
        es_academico = p_es_academico
    WHERE id_departamento = p_id_depto;
    
    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20042, 'Error: No se encontró el departamento con ID ' || p_id_depto);
    END IF;
    COMMIT;
END;
/
-- DELETE
CREATE OR REPLACE PROCEDURE eliminar_departamento (
    p_id_depto IN departamento.id_departamento%TYPE
) IS
BEGIN
    DELETE FROM departamento WHERE id_departamento = p_id_depto;
    
    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20042, 'Error: No se encontró el departamento con ID ' || p_id_depto);
    END IF;
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        -- No se elimina en caso que el departamento este asignado a un docente o administrativo
        RAISE_APPLICATION_ERROR(-20043, 'No se puede eliminar el departamento porque hay docentes o administrativos asignados a él.');
END;
/

--- TIPO_CURSO ---
-- CREATE
CREATE OR REPLACE PROCEDURE insertar_tipo_curso (
    p_nombre IN tipo_curso.nombre%TYPE
) IS
BEGIN
    INSERT INTO tipo_curso (nombre) VALUES (p_nombre);
    COMMIT;
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        RAISE_APPLICATION_ERROR(-20050, 'Error: Ya existe un tipo de curso llamado: ' || p_nombre);
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20051, 'Error al insertar tipo de curso: ' || SQLERRM);
END;
/
-- UPDATE
CREATE OR REPLACE PROCEDURE actualizar_tipo_curso (
    p_id_tipo IN tipo_curso.id_tipo_curso%TYPE,
    p_nombre  IN tipo_curso.nombre%TYPE
) IS
BEGIN
    UPDATE tipo_curso 
    SET nombre = p_nombre 
    WHERE id_tipo_curso = p_id_tipo;
    
    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20052, 'Error: No se encontró el tipo de curso con ID ' || p_id_tipo);
    END IF;
    COMMIT;
END;
/
-- DELETE
CREATE OR REPLACE PROCEDURE eliminar_tipo_curso (
    p_id_tipo IN tipo_curso.id_tipo_curso%TYPE
) IS
BEGIN
    DELETE FROM tipo_curso WHERE id_tipo_curso = p_id_tipo;
    
    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20052, 'Error: No se encontró el tipo de curso con ID ' || p_id_tipo);
    END IF;
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        -- No se borrara si al menos un curso ya esta registrado con este tipo
        RAISE_APPLICATION_ERROR(-20053, 'No se puede eliminar el tipo de curso porque ya existen cursos registrados bajo esta categoría.');
END;
/

--- USUARIO ---
-- CREATE
CREATE OR REPLACE PROCEDURE insertar_usuario (
    p_num_empleado   IN usuario.numero_empleado%TYPE,
    p_nombre         IN usuario.nombre%TYPE,
    p_ap_paterno     IN usuario.apellido_paterno%TYPE,
    p_ap_materno     IN usuario.apellido_materno%TYPE,
    p_correo         IN usuario.correo%TYPE,
    p_nivel_acceso   IN usuario.nivel_acceso%TYPE DEFAULT 0
) IS
BEGIN
    INSERT INTO usuario (
        numero_empleado, nombre, apellido_paterno, apellido_materno, correo, nivel_acceso
    ) VALUES (
        p_num_empleado, p_nombre, p_ap_paterno, p_ap_materno, p_correo, p_nivel_acceso
    );
    COMMIT;
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        RAISE_APPLICATION_ERROR(-20060, 'Error: El número de empleado ' || p_num_empleado || ' ya está registrado.');
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20061, 'Error al insertar usuario: ' || SQLERRM);
END;
/
-- UPDATE
CREATE OR REPLACE PROCEDURE actualizar_usuario (
    p_id_usuario     IN usuario.id_usuario%TYPE,
    p_num_empleado   IN usuario.numero_empleado%TYPE,
    p_nombre         IN usuario.nombre%TYPE,
    p_ap_paterno     IN usuario.apellido_paterno%TYPE,
    p_ap_materno     IN usuario.apellido_materno%TYPE,
    p_correo         IN usuario.correo%TYPE,
    p_nivel_acceso   IN usuario.nivel_acceso%TYPE
) IS
BEGIN
    UPDATE usuario 
    SET numero_empleado = p_num_empleado,
        nombre = p_nombre,
        apellido_paterno = p_ap_paterno,
        apellido_materno = p_ap_materno,
        correo = p_correo,
        nivel_acceso = p_nivel_acceso
    WHERE id_usuario = p_id_usuario;
    
    -- Si no se encontró el ID del usuario
    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20062, 'Error: No se encontró el usuario con ID ' || p_id_usuario);
    END IF;

    COMMIT;
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        ROLLBACK;
        -- Este error salta si el número de empleado ingresado es uno que ya tiene otro usuario
        RAISE_APPLICATION_ERROR(-20060, 'Error: El número de empleado ' || p_num_empleado || ' ya está asignado a otro usuario.');
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20061, 'Error inesperado al actualizar usuario: ' || SQLERRM);
END;
/
-- DELETE
CREATE OR REPLACE PROCEDURE eliminar_usuario (
    p_id_usuario IN usuario.id_usuario%TYPE
) IS
BEGIN
    DELETE FROM usuario WHERE id_usuario = p_id_usuario;
    
    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20062, 'Error: No se encontró el usuario con ID ' || p_id_usuario);
    END IF;
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        -- No se eliminará si tiene un rol como Docente, Administrativo, Instructor o Admin
        RAISE_APPLICATION_ERROR(-20063, 'No se puede eliminar el usuario porque tiene roles o inscripciones activas (Docente, Instructor, etc.).');
END;
/

--- DOCENTES ---
-- CREATE
CREATE OR REPLACE PROCEDURE insertar_docente (
    p_id_usuario     IN docente.id_usuario%TYPE,
    p_id_plaza       IN docente.id_plaza%TYPE,
    p_id_departamento IN docente.id_departamento%TYPE
) IS
    v_es_academico NUMBER;
BEGIN
    -- Se verifica que el departamento sea académico
    SELECT es_academico INTO v_es_academico 
    FROM departamento 
    WHERE id_departamento = p_id_departamento;

    IF v_es_academico = 0 THEN
        RAISE_APPLICATION_ERROR(-20070, 'Error: No se puede asignar un docente a un departamento que no es academico.');
    END IF;

    INSERT INTO docente (id_usuario, id_plaza, id_departamento) 
    VALUES (p_id_usuario, p_id_plaza, p_id_departamento);
    
    COMMIT;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20071, 'Error: El ID de usuario o departamento no existe.');
    WHEN DUP_VAL_ON_INDEX THEN
        RAISE_APPLICATION_ERROR(-20072, 'Error: Este usuario ya está registrado como docente.');
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20073, 'Error al insertar docente: ' || SQLERRM);
END;
/
-- UPDATE
CREATE OR REPLACE PROCEDURE actualizar_docente (
    p_id_usuario     IN docente.id_usuario%TYPE,
    p_id_plaza       IN docente.id_plaza%TYPE,
    p_id_departamento IN docente.id_departamento%TYPE
) IS
    v_es_academico NUMBER;
BEGIN
    -- Validar el departamento antes de actualizar
    SELECT es_academico INTO v_es_academico 
    FROM departamento 
    WHERE id_departamento = p_id_departamento;

    IF v_es_academico = 0 THEN
        RAISE_APPLICATION_ERROR(-20070, 'Error: El departamento de destino debe ser académico.');
    END IF;

    UPDATE docente 
    SET id_plaza = p_id_plaza,
        id_departamento = p_id_departamento
    WHERE id_usuario = p_id_usuario;

    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20074, 'Error: No se encontró el registro docente para el usuario ' || p_id_usuario);
    END IF;
    
    COMMIT;
END;
/
-- DELETE
CREATE OR REPLACE PROCEDURE eliminar_docente (
    p_id_usuario IN docente.id_usuario%TYPE
) IS
BEGIN
    DELETE FROM docente WHERE id_usuario = p_id_usuario;

    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20074, 'Error: No se encontró el registro docente.');
    END IF;
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20075, 'Error al eliminar: Asegúrate de que el docente no tenga registros vinculados.');
END;
/

-- ADMINISTRATIVO --
-- CREATE
CREATE OR REPLACE PROCEDURE insertar_administrativo (
    p_id_usuario     IN administrativo.id_usuario%TYPE,
    p_id_departamento IN administrativo.id_departamento%TYPE
) IS
BEGIN
    INSERT INTO administrativo (id_usuario, id_departamento) 
    VALUES (p_id_usuario, p_id_departamento);
    
    COMMIT;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20080, 'Error: El ID de usuario o departamento no existe.');
    WHEN DUP_VAL_ON_INDEX THEN
        RAISE_APPLICATION_ERROR(-20081, 'Error: Este usuario ya está registrado como administrativo.');
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20082, 'Error al insertar administrativo: ' || SQLERRM);
END;
/
-- UPDATE
CREATE OR REPLACE PROCEDURE actualizar_administrativo (
    p_id_usuario     IN administrativo.id_usuario%TYPE,
    p_id_departamento IN administrativo.id_departamento%TYPE
) IS
BEGIN
    UPDATE administrativo 
    SET id_departamento = p_id_departamento
    WHERE id_usuario = p_id_usuario;

    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20083, 'Error: No se encontró el registro administrativo para el usuario ' || p_id_usuario);
    END IF;
    
    COMMIT;
END;
/
-- DELETE
CREATE OR REPLACE PROCEDURE eliminar_administrativo (
    p_id_usuario IN administrativo.id_usuario%TYPE
) IS
BEGIN
    DELETE FROM administrativo WHERE id_usuario = p_id_usuario;

    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20083, 'Error: No se encontró el registro administrativo.');
    END IF;
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20084, 'Error al eliminar: Asegúrate de que no existan dependencias activas.');
END;
/

-- INSTRUCTORES --
-- CREATE
CREATE OR REPLACE PROCEDURE insertar_instructor (
    p_id_usuario      IN instructor.id_usuario%TYPE,
    p_password_acceso IN instructor.password_acceso%TYPE
) IS
BEGIN
    INSERT INTO instructor (id_usuario, password_acceso) 
    VALUES (p_id_usuario, p_password_acceso);
    
    COMMIT;
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        RAISE_APPLICATION_ERROR(-20090, 'Error: Este usuario ya está registrado como instructor.');
    WHEN OTHERS THEN
        ROLLBACK;
        IF SQLCODE = -2291 THEN
            RAISE_APPLICATION_ERROR(-20091, 'Error: El ID de usuario proporcionado no existe en la tabla Usuario.');
        ELSE
            RAISE_APPLICATION_ERROR(-20092, 'Error al insertar instructor: ' || SQLERRM);
        END IF;
END;
/
-- UPDATE
CREATE OR REPLACE PROCEDURE actualizar_instructor (
    p_id_usuario      IN instructor.id_usuario%TYPE,
    p_password_acceso IN instructor.password_acceso%TYPE
) IS
BEGIN
    UPDATE instructor 
    SET password_acceso = p_password_acceso
    WHERE id_usuario = p_id_usuario;

    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20093, 'Error: No se encontró el registro del instructor con ID ' || p_id_usuario);
    END IF;
    
    COMMIT;
END;
/
-- DELETE
CREATE OR REPLACE PROCEDURE eliminar_instructor (
    p_id_usuario IN instructor.id_usuario%TYPE
) IS
BEGIN
    DELETE FROM instructor WHERE id_usuario = p_id_usuario;

    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20093, 'Error: No se encontró el registro del instructor.');
    END IF;
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        -- Si tiene cursos creados y asignados no se pueden dejan sin instructor
        RAISE_APPLICATION_ERROR(-20094, 'No se puede eliminar al instructor porque tiene cursos asignados.');
END;
/

-- ADMINISTRADOR --
-- CREATE
CREATE OR REPLACE PROCEDURE insertar_administrador (
    p_id_usuario      IN administrador.id_usuario%TYPE,
    p_password_acceso IN administrador.password_acceso%TYPE
) IS
BEGIN
    -- Validación de nivel de acceso de 1
    UPDATE usuario SET nivel_acceso = 1 WHERE id_usuario = p_id_usuario;

    INSERT INTO administrador (id_usuario, password_acceso) 
    VALUES (p_id_usuario, p_password_acceso);
    
    COMMIT;
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        RAISE_APPLICATION_ERROR(-20100, 'Error: Este usuario ya es un administrador.');
    WHEN OTHERS THEN
        ROLLBACK;
        IF SQLCODE = -2291 THEN
            RAISE_APPLICATION_ERROR(-20101, 'Error: El ID de usuario no existe.');
        ELSE
            RAISE_APPLICATION_ERROR(-20102, 'Error al insertar administrador: ' || SQLERRM);
        END IF;
END;
/
-- UPDATE
CREATE OR REPLACE PROCEDURE actualizar_administrador (
    p_id_usuario      IN administrador.id_usuario%TYPE,
    p_password_acceso IN administrador.password_acceso%TYPE
) IS
BEGIN
    UPDATE administrador 
    SET password_acceso = p_password_acceso
    WHERE id_usuario = p_id_usuario;

    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20103, 'Error: No se encontró el registro del administrador.');
    END IF;
    
    COMMIT;
END;
/
-- DELETE
CREATE OR REPLACE PROCEDURE eliminar_administrador (
    p_id_usuario IN administrador.id_usuario%TYPE
) IS
BEGIN
    -- Baja el nivel de acceso del usuario a 0 ya que no será administrador
    UPDATE usuario SET nivel_acceso = 0 WHERE id_usuario = p_id_usuario;

    DELETE FROM administrador WHERE id_usuario = p_id_usuario;

    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20103, 'Error: No se encontró el administrador.');
    END IF;
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20104, 'Error al eliminar administrador: ' || SQLERRM);
END;
/

--- CURSO ---
-- CREATE

CREATE OR REPLACE PROCEDURE alta_curso (
    -- Datos del Instructor (Lógica Upsert)
    p_num_empleado      IN usuario.numero_empleado%TYPE,
    p_nombre_inst       IN usuario.nombre%TYPE,
    p_ap_paterno        IN usuario.apellido_paterno%TYPE,
    p_ap_materno        IN usuario.apellido_materno%TYPE,
    p_correo            IN usuario.correo%TYPE,
    -- Datos del Curso
    p_nombre_curso      IN curso.nombre%TYPE,
    p_nombre_tipo       IN VARCHAR2, -- ('Docente' o 'Profesional')
    p_duracion          IN curso.duracion%TYPE,
    p_total_horas       IN curso.total_horas%TYPE,
    p_cupo_maximo       IN curso.cupo_maximo%TYPE,
    p_anio              IN curso.anio%TYPE,
    p_periodo           IN curso.periodo%TYPE,
    p_fecha_inicio      IN curso.fecha_inicio%TYPE,
    p_fecha_termino     IN curso.fecha_termino%TYPE,
    p_dias_semana       IN curso.dias_semana%TYPE,
    p_horario           IN curso.horario%TYPE,
    p_id_curso_gen      OUT curso.id_curso%TYPE
) IS 
    v_id_usuario usuario.id_usuario%TYPE;
    v_id_tipo    tipo_curso.id_tipo_curso%TYPE;
BEGIN
    -- 1. Buscar el ID del tipo de curso
    SELECT id_tipo_curso INTO v_id_tipo 
    FROM tipo_curso 
    WHERE nombre = p_nombre_tipo;

    -- 2. Buscar el instructor, si no existe insertarlo
    BEGIN
        SELECT id_usuario INTO v_id_usuario FROM usuario WHERE numero_empleado = p_num_empleado;
        INSERT INTO instructor (id_usuario, password_acceso)
        SELECT v_id_usuario, 'TempPass123' FROM DUAL
        WHERE NOT EXISTS (SELECT 1 FROM instructor WHERE id_usuario = v_id_usuario);
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO usuario (numero_empleado, nombre, apellido_paterno, apellido_materno, correo, nivel_acceso)
            VALUES (p_num_empleado, p_nombre_inst, p_ap_paterno, p_ap_materno, p_correo, 0)
            RETURNING id_usuario INTO v_id_usuario;
            INSERT INTO instructor (id_usuario, password_acceso) VALUES (v_id_usuario, 'TempPass123');
    END;

    -- 3. Insertar el curso
    INSERT INTO CURSO (
        id_instructor, nombre, duracion, total_horas, 
        cupo_maximo, anio, periodo, fecha_inicio, 
        fecha_termino, dias_semana, horario, id_tipo_curso
    ) VALUES (
        v_id_usuario, p_nombre_curso, p_duracion, p_total_horas, 
        p_cupo_maximo, p_anio, p_periodo, p_fecha_inicio, 
        p_fecha_termino, p_dias_semana, p_horario, v_id_tipo
    ) RETURNING id_curso INTO p_id_curso_gen;
    
    COMMIT;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20005, 'Error: El tipo de curso "' || p_nombre_tipo || '" no existe en el catálogo.');
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20004, 'Error en alta_curso: ' || SQLERRM);
END alta_curso;
/
-- UPDATE
CREATE OR REPLACE PROCEDURE actualizar_curso (
    p_id_curso     IN curso.id_curso%TYPE,
    p_nombre       IN curso.nombre%TYPE,
    p_anio         IN curso.anio%TYPE,
    p_periodo      IN curso.periodo%TYPE,
    p_cupo_max     IN curso.cupo_maximo%TYPE,
    p_id_instructor IN curso.id_instructor%TYPE,
    p_id_tipo      IN curso.id_tipo_curso%TYPE,
    p_fecha_inicio IN curso.fecha_inicio%TYPE,
    p_fecha_termino IN curso.fecha_termino%TYPE,
    p_dias_semana IN curso.dias_semana%TYPE,
    p_horario IN curso.horario%TYPE
) IS
BEGIN
    UPDATE curso 
    SET nombre = p_nombre,
        anio = p_anio,
        periodo = p_periodo,
        cupo_maximo = p_cupo_max,
        id_instructor = p_id_instructor,
        id_tipo_curso = p_id_tipo,
	fecha_inicio = p_fecha_inicio,
    	fecha_termino = p_fecha_termino,
    	dias_semana = p_dias_semana,
    	horario = p_horario
    WHERE id_curso = p_id_curso;

    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20110, 'Error: No se encontró el curso con ID ' || p_id_curso);
    END IF;
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20111, 'Error al actualizar el curso: ' || SQLERRM);
END;
/
-- DELETE
CREATE OR REPLACE PROCEDURE eliminar_curso (
    p_id_curso IN curso.id_curso%TYPE
) IS
BEGIN
    -- 1. Eliminamos los temas vinculados con el curso
    DELETE FROM tema_curso 
    WHERE id_curso = p_id_curso;

    -- 2. Eliminamos el curso
    DELETE FROM curso 
    WHERE id_curso = p_id_curso;

    -- 3. Se checa que se haya eliminado
    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20110, 'Error: No se encontró el curso con ID ' || p_id_curso);
    END IF;
    
    COMMIT;
    
EXCEPTION
    -- Si el curso tiene alumnos no se puede eliminar
    WHEN OTHERS THEN
        ROLLBACK;
        IF SQLCODE = -2292 THEN
            RAISE_APPLICATION_ERROR(-20112, 'No se puede eliminar: El curso tiene alumnos inscritos. Borra primero las inscripciones.');
        ELSE
            RAISE_APPLICATION_ERROR(-20113, 'Error crítico al eliminar curso: ' || SQLERRM);
        END IF;
END;
/

--- TEMA_CURSO ---
-- CREATE
CREATE OR REPLACE PROCEDURE alta_tema_curso (
		p_id_curso IN tema_curso.id_curso%TYPE,
		p_titulo_tema IN tema_curso.titulo_tema%TYPE,
		p_horas_duracion IN tema_curso.horas_duracion%TYPE
	)
	IS BEGIN
		INSERT INTO TEMA_CURSO(id_curso,titulo_tema,horas_duracion)
		VALUES(p_id_curso,p_titulo_tema,p_horas_duracion);
		COMMIT;
	EXCEPTION
    		WHEN OTHERS THEN
        	ROLLBACK;
        	RAISE_APPLICATION_ERROR(-20120, 'Error al insertar tema: ' || SQLERRM);
	END alta_tema_curso;
/
-- UPDATE
CREATE OR REPLACE PROCEDURE actualizar_tema_curso (
    p_id_tema        IN tema_curso.id_tema%TYPE,
    p_titulo_tema    IN tema_curso.titulo_tema%TYPE,
    p_horas_duracion IN tema_curso.horas_duracion%TYPE
) IS
BEGIN
    UPDATE tema_curso 
    SET titulo_tema = p_titulo_tema,
        horas_duracion = p_horas_duracion
    WHERE id_tema = p_id_tema;

    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20121, 'Error: No se encontró el tema con ID ' || p_id_tema);
    END IF;
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20122, 'Error al actualizar el tema: ' || SQLERRM);
END;
/
-- DELETE
CREATE OR REPLACE PROCEDURE eliminar_tema_curso (
    p_id_tema IN tema_curso.id_tema%TYPE
) IS
BEGIN
    DELETE FROM tema_curso WHERE id_tema = p_id_tema;

    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20121, 'Error: No se encontró el tema con ID ' || p_id_tema);
    END IF;
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20123, 'Error al eliminar el tema: ' || SQLERRM);
END;
/

--- INSCRIPCION ---
-- CREATE DOCENTE
CREATE OR REPLACE PROCEDURE inscribir_docente (
    p_num_empleado   IN usuario.numero_empleado%TYPE,
    p_nombre         IN usuario.nombre%TYPE,
    p_ap_paterno     IN usuario.apellido_paterno%TYPE,
    p_ap_materno     IN usuario.apellido_materno%TYPE,
    p_correo         IN usuario.correo%TYPE,
    p_id_depto       IN departamento.id_departamento%TYPE,
    p_id_plaza       IN tipo_plaza.id_plaza%TYPE,
    p_id_curso       IN curso.id_curso%TYPE
) IS
    v_id_usuario   usuario.id_usuario%TYPE;
    v_es_academico NUMBER;
    v_cupo_max     NUMBER;
    v_inscritos    NUMBER;
BEGIN
    -- 1. Validar el usuario a menos que ya este registrado
    BEGIN
        INSERT INTO usuario (numero_empleado, nombre, apellido_paterno, apellido_materno, correo, nivel_acceso)
        VALUES (p_num_empleado, p_nombre, p_ap_paterno, p_ap_materno, p_correo, 0)
        RETURNING id_usuario INTO v_id_usuario;
    EXCEPTION
        WHEN DUP_VAL_ON_INDEX THEN
            SELECT id_usuario INTO v_id_usuario FROM usuario WHERE numero_empleado = p_num_empleado;
    END;

    -- 2. Validar que el departamento sea académico para el docente
    SELECT es_academico INTO v_es_academico FROM departamento WHERE id_departamento = p_id_depto;
    IF v_es_academico = 0 THEN
        RAISE_APPLICATION_ERROR(-20020, 'Error: Los docentes requieren un departamento académico.');
    END IF;

    -- 3. Validar que sea un docente o registrarlo
    BEGIN
        INSERT INTO docente (id_usuario, id_plaza, id_departamento)
        VALUES (v_id_usuario, p_id_plaza, p_id_depto);
    EXCEPTION
        WHEN DUP_VAL_ON_INDEX THEN
            NULL; 
    END;

    -- 4. Validación de cupo
    SELECT cupo_maximo INTO v_cupo_max 
    FROM curso 
    WHERE id_curso = p_id_curso 
    FOR UPDATE;
    
    SELECT COUNT(*) INTO v_inscritos 
    FROM inscripcion 
    WHERE id_curso = p_id_curso;

    IF v_inscritos >= v_cupo_max THEN
        RAISE_APPLICATION_ERROR(-20010, 'Cupo agotado. Máximo: ' || v_cupo_max);
    END IF;

    -- 5. Inscripción final
    INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
    VALUES (v_id_usuario, p_id_curso, SYSDATE, 0);

    COMMIT;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20012, 'Error: El curso o departamento solicitado no existe.');
    
    WHEN DUP_VAL_ON_INDEX THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20011, 'Ya estás inscrito en este curso.');

    WHEN OTHERS THEN
        ROLLBACK;
        -- Si el código de error es uno de los nuestros (-20000 al -20999), lo lanzamos tal cual
        IF SQLCODE BETWEEN -20999 AND -20000 THEN
            RAISE;
        ELSE
            RAISE_APPLICATION_ERROR(-20013, 'Error crítico: ' || SQLERRM);
        END IF;
END;
/
-- CREATE ADMINISTRATIVO
CREATE OR REPLACE PROCEDURE inscribir_administrativo (
    p_num_empleado   IN usuario.numero_empleado%TYPE,
    p_nombre         IN usuario.nombre%TYPE,
    p_ap_paterno     IN usuario.apellido_paterno%TYPE,
    p_ap_materno     IN usuario.apellido_materno%TYPE,
    p_correo         IN usuario.correo%TYPE,
    p_id_depto       IN departamento.id_departamento%TYPE,
    p_id_curso       IN curso.id_curso%TYPE
) IS
    v_id_usuario   usuario.id_usuario%TYPE;
    v_cupo_max     NUMBER;
    v_inscritos    NUMBER;
BEGIN
    -- 1. Validar usuario o se registra si no existe
    BEGIN
        INSERT INTO usuario (numero_empleado, nombre, apellido_paterno, apellido_materno, correo, nivel_acceso)
        VALUES (p_num_empleado, p_nombre, p_ap_paterno, p_ap_materno, p_correo, 0)
        RETURNING id_usuario INTO v_id_usuario;
    EXCEPTION
        WHEN DUP_VAL_ON_INDEX THEN
            SELECT id_usuario INTO v_id_usuario FROM usuario WHERE numero_empleado = p_num_empleado;
    END;

    -- 2. Validación de administrativo o su registro en la tabla
    BEGIN
        INSERT INTO administrativo (id_usuario, id_departamento)
        VALUES (v_id_usuario, p_id_depto);
    EXCEPTION
        WHEN DUP_VAL_ON_INDEX THEN
            NULL;
    END;

    -- 3. Validación del cupo
    SELECT cupo_maximo INTO v_cupo_max 
    FROM curso 
    WHERE id_curso = p_id_curso 
    FOR UPDATE;
    
    SELECT COUNT(*) INTO v_inscritos 
    FROM inscripcion 
    WHERE id_curso = p_id_curso;

    IF v_inscritos >= v_cupo_max THEN
        RAISE_APPLICATION_ERROR(-20010, 'No hay lugares disponibles en este curso. Máximo: ' || v_cupo_max);
    END IF;

    -- 4. Inscripción final
    INSERT INTO inscripcion (id_usuario, id_curso, fecha_inscripcion, estado)
    VALUES (v_id_usuario, p_id_curso, SYSDATE, 0);

    COMMIT;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20012, 'Error: El curso solicitado no existe.');
    
    WHEN DUP_VAL_ON_INDEX THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20011, 'Ya te encuentras inscrito en este curso.');

    WHEN OTHERS THEN
        ROLLBACK;
        -- Si el error es una excepción personalizada nuestra (-20000 al -20999), la dejamos pasar limpia
        IF SQLCODE BETWEEN -20999 AND -20000 THEN
            RAISE;
        ELSE
            RAISE_APPLICATION_ERROR(-20013, 'Error crítico en el servidor: ' || SQLERRM);
        END IF;
END;
/
-- UPDATE
CREATE OR REPLACE PROCEDURE actualizar_estado_inscripcion (
    p_id_usuario IN inscripcion.id_usuario%TYPE,
    p_id_curso   IN inscripcion.id_curso%TYPE,
    p_nuevo_estado IN inscripcion.estado%TYPE -- 0: Pendiente, 1: Aprobado, 2: Reprobado/Cancelado
) IS
BEGIN
    UPDATE inscripcion 
    SET estado = p_nuevo_estado
    WHERE id_usuario = p_id_usuario 
      AND id_curso = p_id_curso;

    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20130, 'Error: No se encontró la inscripción para el usuario ' || p_id_usuario || ' en el curso ' || p_id_curso);
    END IF;
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20131, 'Error al actualizar el estado: ' || SQLERRM);
END;
/
-- DELETE
CREATE OR REPLACE PROCEDURE eliminar_inscripcion (
    p_id_usuario IN inscripcion.id_usuario%TYPE,
    p_id_curso   IN inscripcion.id_curso%TYPE
) IS
BEGIN
    DELETE FROM inscripcion 
    WHERE id_usuario = p_id_usuario 
      AND id_curso = p_id_curso;

    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20130, 'Error: No se encontró la inscripción para eliminar.');
    END IF;
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20132, 'Error al eliminar la inscripción: ' || SQLERRM);
END;
/

--- CONSTANCIA ---
-- CREATE
CREATE OR REPLACE PROCEDURE generar_constancia (
    p_id_inscripcion IN constancia.id_inscripcion%TYPE,
    p_tipo_formato   IN constancia.tipo_formato%TYPE,
    p_url_descarga   IN constancia.url_descarga%TYPE
) IS
    v_estado_insc NUMBER;
BEGIN
    -- Solo se genera la constancia si el curso del alumno esta aprobado
    SELECT estado INTO v_estado_insc 
    FROM inscripcion 
    WHERE id_inscripcion = p_id_inscripcion;

    IF v_estado_insc <> 1 THEN
        RAISE_APPLICATION_ERROR(-20140, 'Error: No se puede generar constancia de una inscripción no aprobada.');
    END IF;

    INSERT INTO constancia (id_inscripcion, tipo_formato, url_descarga) 
    VALUES (p_id_inscripcion, p_tipo_formato, p_url_descarga);
    
    COMMIT;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20141, 'Error: El ID de inscripción no existe.');
    WHEN DUP_VAL_ON_INDEX THEN
        RAISE_APPLICATION_ERROR(-20142, 'Error: Ya existe una constancia generada para esta inscripción.');
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20143, 'Error al generar constancia: ' || SQLERRM);
END;
/
-- UPDATE
CREATE OR REPLACE PROCEDURE actualizar_constancia (
    p_folio_numero IN constancia.folio_numero%TYPE,
    p_tipo_formato IN constancia.tipo_formato%TYPE,
    p_url_descarga IN constancia.url_descarga%TYPE
) IS
BEGIN
    UPDATE constancia 
    SET tipo_formato = p_tipo_formato,
        url_descarga = p_url_descarga,
        fecha_generacion = SYSDATE -- Actualizamos la fecha de regeneración
    WHERE folio_numero = p_folio_numero;

    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20144, 'Error: No se encontró la constancia con el folio ' || p_folio_numero);
    END IF;
    
    COMMIT;
END actualizar_constancia;
/
-- DELETE
CREATE OR REPLACE PROCEDURE eliminar_constancia (
    p_folio_numero IN constancia.folio_numero%TYPE
) IS
BEGIN
    DELETE FROM constancia WHERE folio_numero = p_folio_numero;

    IF SQL%NOTFOUND THEN
        RAISE_APPLICATION_ERROR(-20144, 'Error: No se encontró la constancia.');
    END IF;
    
    COMMIT;
END;
/