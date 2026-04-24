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