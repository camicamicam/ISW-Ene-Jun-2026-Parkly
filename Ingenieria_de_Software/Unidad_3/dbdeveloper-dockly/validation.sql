SET SERVEROUTPUT ON;

PROMPT ====================================================================
PROMPT          SCRIPT DE VALIDACIÓN DE CALIDAD: ESQUEMA DEL PROYECTO
PROMPT ====================================================================

DECLARE
    v_tablas         NUMBER := 0;
    v_vistas         NUMBER := 0;
    v_triggers       NUMBER := 0;
    v_procedimientos NUMBER := 0;
    v_indices        NUMBER := 0;
BEGIN
    -- 1. Contar Tablas
    SELECT COUNT(*) INTO v_tablas FROM user_objects WHERE object_type = 'TABLE';
    
    -- 2. Contar Vistas
    SELECT COUNT(*) INTO v_vistas FROM user_objects WHERE object_type = 'VIEW';
    
    -- 3. Contar Triggers
    SELECT COUNT(*) INTO v_triggers FROM user_objects WHERE object_type = 'TRIGGER';
    
    -- 4. Contar Procedimientos
    SELECT COUNT(*) INTO v_procedimientos FROM user_objects WHERE object_type = 'PROCEDURE';
    
    -- 5. Contar Índices (Unique constraints y manuales)
    SELECT COUNT(*) INTO v_indices FROM user_objects WHERE object_type = 'INDEX';

    -- IMPRESIÓN DEL REPORTE RESUMIDO
    DBMS_OUTPUT.PUT_LINE('----------------------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('RESUMEN DE MÉTRICAS DEL PROYECTO:');
    DBMS_OUTPUT.PUT_LINE('----------------------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('[-] Total de Tablas Base y Bitácoras : ' || v_tablas);
    DBMS_OUTPUT.PUT_LINE('[-] Total de Índices Creados         : ' || v_indices);
    DBMS_OUTPUT.PUT_LINE('[-] Total de Disparadores (Triggers)  : ' || v_triggers);
    DBMS_OUTPUT.PUT_LINE('[-] Total de Procedimientos Almacenados: ' || v_procedimientos);
    DBMS_OUTPUT.PUT_LINE('[-] Total de Vistas del Sistema      : ' || v_vistas);
    DBMS_OUTPUT.PUT_LINE('----------------------------------------------------------------');
    
    IF v_tablas >= 14 AND v_triggers >= 3 AND v_vistas >= 1 THEN
        DBMS_OUTPUT.PUT_LINE('>>> ¡VALIDACIÓN EXITOSA! El ecosistema de datos está completo. <<<');
    ELSE
        DBMS_OUTPUT.PUT_LINE('>>> ALERTA: Faltan objetos en el esquema. Revisa tus scripts de creación. <<<');
    END IF;
    DBMS_OUTPUT.PUT_LINE('===================================================================');
END;
/

-- CONSULTA DETALLADA (Por si quieres ver los nombres exactos en la consola)
PROMPT
PROMPT DESGLOSE DETALLADO DE OBJETOS ACTIVOS:
SELECT object_type AS "TIPO DE OBJETOS", 
       COUNT(*) AS "CANTIDAD ACTUAL"
FROM user_objects 
WHERE object_type IN ('TABLE', 'VIEW', 'TRIGGER', 'PROCEDURE', 'INDEX')
GROUP BY object_type
ORDER BY object_type;