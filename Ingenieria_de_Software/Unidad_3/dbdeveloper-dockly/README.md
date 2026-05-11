### Base de Datos  

### Archivos  
  squema.sql : estructura y vistas  
  seed.sql : datos de prueba  
  procedimientos.sql : CUD para todas las tablas  
  bitacora.sql : tablas y triggers para bitacoras  
### Cómo ejecutar (Oracle Cloud)  
1. Create Autonomous AI Database  
2. Database Configuration - Always free  
3. Administrator credentials creation  
4. Create  
5. Database Actions -> SQL  
6. Abrir (Ctrl+O) -> squema.sql  
7. Ejecutar script (F5)
8. Abrir (Ctrl+O) -> procedimientos.sql  
9. Ejecutar script (F5)
10. Abrir (Ctrl+O) -> bitacora.sql  
11. Ejecutar script (F5)  
12. Abrir (Ctrl+O) -> seed.sql  
13. Ejecutar script (F5)  
## Tablas principales  
usuario : tabla padre de todos los usuarios  
docente/administrativo : tablas de especialización vinculadas por id_usuario  
instructor/administrador : credenciales de acceso específicas para estos roles  
curso y tema_curso : gestión de cursos con temarios dinámicos y horas desglosadas  
inscripcion: relación entre usuarios y cursos
