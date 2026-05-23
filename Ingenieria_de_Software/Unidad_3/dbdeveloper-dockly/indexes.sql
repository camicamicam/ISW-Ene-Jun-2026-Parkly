-- filtrar inscripciones por fecha
CREATE INDEX idx_inscripcion_fecha 
ON inscripcion (fecha_inscripcion);

-- filtrar los cursos que da un instructor
CREATE INDEX idx_curso_instructor 
ON curso (id_instructor);

-- filtrar temas de curso por curso
CREATE INDEX idx_tema_curso_padre 
ON tema_curso (id_curso);

-- filtrar cursos por su nombre
CREATE INDEX idx_curso_nombre 
ON curso (nombre);