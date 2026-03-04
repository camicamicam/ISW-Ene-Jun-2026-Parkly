# E2 - Desarrollador/Integrador
## Tipos de usuarios desde una perspectiva técnica (Roles)
- #### Usuario de registro y consulta (Docente/Administrativo):
	- Actúa como el consumidor final de la oferta académica.
	- Técnicamente, es un perfil de entrada de datos personales (nombre, correo, plaza) y consulta de registros históricos (constancias).
	- Su flujo depende de la selección de información preexistente en menús desplegables.
- #### Usuario de gestión de contenido (Instructor):
	- Funciona como el proveedor de los metadatos del curso (temas y carga horaria).
	- Tiene un rol de carga de información dinámica, requiriendo una interfaz capaz de gestionar múltiples entradas de datos según el programa del curso.
	- Es el primer filtro de seguridad del sistema al requerir una autenticación específica para acceder a la carga de datos.
- #### Entidad de control de acceso (DDA):
     Aunque no interactúa directamente con la interfaz descrita, actúa técnicamente como el administrador externo de identidades y credenciales.

## Restricciones técnicas relacionadas con el uso
- #### Sincronización de servicios de mensajería: 
  El sistema debe integrarse obligatoriamente con un servicio de correo electrónico para asegurar que la confirmación de inscripción llegue al usuario de forma externa a la plataforma.
- #### Validación y persistencia de estados: 
  El sistema requiere un mecanismo de validación de datos en tiempo real; ante cualquier error detectado por el usuario, el estado de la interfaz debe reiniciarse por completo (limpieza de campos) para garantizar la integridad de la información capturada.
- #### Control de acceso centralizado y externo: 
  El ingreso para instructores está restringido por una contraseña que no se autogestiona en el sitio, lo que implica una dependencia técnica de una base de datos de credenciales externa o física.
- #### Interdependencia de datos para procesos finales: 
  La generación de documentos de salida (constancias) está técnicamente limitada a la concurrencia de datos; si alguno de los perfiles (docente, administrativo o instructor) no completa su captura, el objeto final no puede ser procesado.
- #### Operatividad en entorno web: 
  Al ser un sitio web, el sistema requiere una conexión constante para el llenado de formularios y la consulta de documentos almacenados en el servidor
