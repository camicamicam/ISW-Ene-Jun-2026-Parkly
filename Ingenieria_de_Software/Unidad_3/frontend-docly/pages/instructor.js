import { navigate } from "../routes/router.js";
import { cursosService } from "../services/cursosService.js";

 // --- GESTIÓN DE ALUMNOS ---
window.abrirGestionAlumnos = async (id, nombre) => {
    const respuesta = await cursosService.obtenerAlumnosPorCurso(id);
    console.log("Datos del alumno recibidos:", respuesta.datos); // <-- Revisa esto en la consola (F12)
    const mainContainer = document.getElementById("main-content");
    
    // 1. Renderizar estructura inicial (un loader)
    mainContainer.innerHTML = `
        <div class="card" style="max-width: 500px; margin: 20px auto;">
            <h3>Gestión de Alumnos: ${nombre}</h3>
            <p id="loading-alumnos">Cargando lista de alumnos...</p>
            <div id="gestion-form-container" style="display:none;">
                <div class="form-group">
                    <label>Seleccionar Alumno</label>
                    <select id="select-alumnos" style="width: 100%; padding: 10px; margin-bottom: 15px;"></select>
                </div>
                <div class="form-group">
                    <label>Horas a registrar</label>
                    <input type="number" id="horas-alumno" placeholder="Ej. 10" min="1" style="width: 100%; padding: 10px;">
                </div>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button onclick="location.reload()" style="background: #2c3e50; flex:1;">Volver</button>
                    <button id="btn-guardar-horas" style="background: #27ae60; flex:1;">Guardar Horas</button>
                </div>
            </div>
        </div>
    `;

    try {
        // 2. Llamar al servicio para obtener alumnos
        const respuesta = await cursosService.obtenerAlumnosPorCurso(id);
        const alumnos = respuesta.datos || [];
        const select = document.getElementById("select-alumnos");
        const loader = document.getElementById("loading-alumnos");
        const formContainer = document.getElementById("gestion-form-container");

        if (alumnos.length === 0) {
            loader.innerText = "No hay alumnos inscritos en este curso.";
            return;
        }

        // 3. Llenar el select con el ID_INSCRIPCION (Como pidió el backend)
        select.innerHTML = alumnos.map(a => `
            <option value="${a.ID_INSCRIPCION}">
                ${a.NOMBRE_COMPLETO}
            </option>
        `).join('');

        loader.style.display = "none";
        formContainer.style.display = "block";

        // 4. Lógica para enviar al backend
        document.getElementById("btn-guardar-horas").onclick = async () => {
            const idInscripcion = select.value;
            const horas = document.getElementById("horas-alumno").value;

            if (!horas) return alert("Ingresa las horas");

            try {
                await cursosService.registrarHorasAlumno(idInscripcion, horas);
                alert("¡Horas registradas correctamente!");
                window.abrirGestionAlumnos(id, nombre); // Recargar la vista
            } catch (err) {
                alert("Error al guardar: " + err.message);
            }
        };

    } catch (error) {
        alert("Error al cargar alumnos: " + error.message);
    }
};
export function instructorPage() {
    const tipoDeCursoActual = localStorage.getItem("seccion_itq") || "Docente";
    setTimeout(() => {

        //---------LÓGICA FORMULARIO---------------
        const btnAdd = document.getElementById("addTema");
        const form = document.getElementById("instructorForm");
        const containerTemas = document.getElementById("container-temas");

        //--Añadir tema
        if (btnAdd) {
            btnAdd.addEventListener("click", () => {
                const div = document.createElement("div");
                div.className = "tema-row";
                // Ajuste de estilos para mayor amplitud
                div.style = "display: flex; gap: 10px; margin-bottom: 12px; align-items: center; width: 100%;";
                div.innerHTML = `
                    <input type="text" placeholder="Nombre del tema" class="tema-input" required 
                           style="flex: 5; min-width: 150px; padding: 10px;">
                    <input type="number" placeholder="Hrs" class="horas-input" min="1" required 
                           style="flex: 1; min-width: 60px; padding: 10px; text-align: center;">
                    <button type="button" class="btn-remove-tema" 
                            style="flex: 0.2; background: #fee2e2; border: 1px solid #f87171; color: #dc2626; 
                                   border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 1.2rem; 
                                   height: 38px; display: flex; align-items: center; justify-content: center;">
                        &times;
                    </button>
                `;
                containerTemas.appendChild(div);
            });
        }

        // Delegación de eventos para eliminar temas
        if (containerTemas) {
            containerTemas.addEventListener("click", (e) => {
                if (e.target.classList.contains("btn-remove-tema")) {
                    const rows = document.querySelectorAll(".tema-row");
                    if (rows.length > 1) {
                        e.target.parentElement.remove();
                    } else {
                        alert("El curso debe tener al menos un tema.");
                    }
                }
            });
        }

        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                
                const temasRaw = Array.from(document.querySelectorAll(".tema-row")).map(row => ({
                    titulo_tema: row.querySelector(".tema-input").value.trim(),
                    horas_duracion: parseInt(row.querySelector(".horas-input").value, 10)
                }));

                const totalHoras = temasRaw.reduce((acc, curr) => acc + curr.horas_duracion, 0);

                window.tempInstructorData = {
                    curso: {
                        instructor_numero_empleado: parseInt(document.getElementById("numEmpI").value, 10),
                        instructor_nombre: document.getElementById("nombreI").value.trim(),
                        instructor_paterno: document.getElementById("paternoI").value.trim(),
                        instructor_materno: document.getElementById("maternoI").value.trim(),
                        instructor_correo: document.getElementById("correoI").value.trim(),
                        
                        nombre: document.getElementById("nombreC").value.trim(),
                        duracion: totalHoras,
                        fecha_inicio: document.getElementById("fechaI").value,
                        fecha_termino: document.getElementById("fechaT").value,
                        dias_semana: document.getElementById("diasS").value.trim(),
                        horario: document.getElementById("horarioC").value.trim()
                    },
                    temas: temasRaw
                };

                document.getElementById("main-content").innerHTML = renderConfirmacion();
            });
        }

         // --- LÓGICA PARA CARGAR CURSOS EXISTENTES ---
        const cargarCursos = async () => {
            const listaCursosContainer = document.getElementById("lista-cursos-instructor");
            
            if (!listaCursosContainer) {
                setTimeout(cargarCursos, 100);
                return;
            }

            try {
                const respuesta = await cursosService.obtenerCursosDisponibles(tipoDeCursoActual);
                
                // Accedemos a respuesta.datos porque ahí es donde vienen los cursos según tu consola
                const listaFinal = respuesta.datos || [];

                if (listaFinal.length === 0) {
                    listaCursosContainer.innerHTML = `
                        <div style="text-align:center; padding: 20px; color: #666; background: #f9f9f9; border-radius: 8px;">
                            No hay cursos de tipo "${tipoDeCursoActual}" registrados.
                        </div>`;
                    return;
                }

                // Mapeamos usando los nombres de campos en MAYÚSCULAS que manda el servidor
                listaCursosContainer.innerHTML = listaFinal.map(curso => `
                    <div class="curso-card-mini" style="background: white; padding: 9px; border-radius: 8px; border-left: 5px solid #2c3e50; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h4 style="margin: 0 0 5px 0; color: #2c3e50;">${curso.NOMBRE_CURSO}</h4>
                            <div style="font-size: 0.85rem; color: #666;">
                                <span><strong>ID:</strong> ${curso.ID_CURSO}</span> | 
                                <span><strong>Horas Totales:</strong> ${curso.TOTAL_HORAS}</span>
                            </div>
                        </div>
                        <button class="btn-alumnos" 
                            data-id="${curso.ID_CURSO}" 
                            data-nombre="${curso.NOMBRE_CURSO}"
                            style="
                                background: #2c3e50; 
                                color: white; 
                                border: none; 
                                padding: 6px 12px; 
                                border-radius: 4px; 
                                cursor: pointer;
                                width: auto;      /* <--- Esto evita que crezca demasiado */
                                min-width: 100px; /* <--- Tamaño base razonable */
                                font-size: 0.85rem; /* <--- Texto un poco más discreto */
                                white-space: nowrap; /* <--- Evita que el texto se rompa en dos líneas */
                            "> Alumnos
                        </button>
                    </div>
                `).join('');

                // Delegación de eventos para los botones de alumnos
                listaCursosContainer.querySelectorAll('.btn-alumnos').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.getAttribute('data-id');
                        const nombre = btn.getAttribute('data-nombre');
                        window.abrirGestionAlumnos(id, nombre);
                    });
                });

            } catch (error) {
                console.error("Fallo al cargar:", error);
                listaCursosContainer.innerHTML = `<p style="color: red; text-align: center;">Error al procesar la lista de cursos.</p>`;
            }
        };

        cargarCursos();
    }, 0);

    window.enviarDatosBackend = async () => {
        const data = window.tempInstructorData;

        const normalizarTexto = (texto) => {
            if (!texto) return "";
            return texto
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim();
        };

        const payload = {
            curso: {
                tipo_curso: tipoDeCursoActual,
                instructor_numero_empleado: Number(data.curso.instructor_numero_empleado),
                instructor_nombre: normalizarTexto(data.curso.instructor_nombre),
                instructor_paterno: normalizarTexto(data.curso.instructor_paterno),
                instructor_materno: normalizarTexto(data.curso.instructor_materno),
                instructor_correo: data.curso.instructor_correo.trim(),
                
                nombre: normalizarTexto(data.curso.nombre),
                duracion: Number(data.curso.duracion),
                fecha_inicio: data.curso.fecha_inicio,
                fecha_termino: data.curso.fecha_termino,
                dias_semana: normalizarTexto(data.curso.dias_semana),
                horario: data.curso.horario.trim()
            },
            temas: data.temas.map(t => ({
                titulo_tema: normalizarTexto(t.titulo_tema),
                horas_duracion: Number(t.horas_duracion)
            }))
        };

        try {
            const resultado = await cursosService.registrarCurso(payload);
            if (resultado) {
                alert('¡Curso registrado con éxito!');
                location.reload()
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    function renderConfirmacion() {
        const data = window.tempInstructorData;
        // Concatenación del nombre completo
        const nombreCompleto = `${data.curso.instructor_nombre} ${data.curso.instructor_paterno} ${data.curso.instructor_materno}`;

        return `
            <div class="instructor-container">
                <div class="card summary-card" style="max-width: 500px; margin: auto;">
                    <h2 style="text-align: center; color: #2c3e50; margin-bottom: 20px;">Confirmar Registro</h2>
                    
                    <div style="text-align: center; margin-bottom: 15px;">
                        <span style="background: #34495e; color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.8rem;">
                            MODALIDAD: ${tipoDeCursoActual}
                        </span>
                    </div>

                    <h4 style="color: #34495e; border-bottom: 2px solid #2c3e50; padding-bottom: 5px;">Datos del Instructor</h4>
                    <div class="summary-list" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; padding: 10px 0;">
                        <div class="summary-item"><strong>N° Empleado:</strong> ${data.curso.instructor_numero_empleado}</div>
                        <div class="summary-item"><strong>Nombre Completo:</strong> ${nombreCompleto}</div>
                        <div class="summary-item"><strong>Correo:</strong> ${data.curso.instructor_correo}</div>
                    </div>

                    <h4 style="color: #34495e; border-bottom: 2px solid #2c3e50; padding-bottom: 5px;">Datos del Curso</h4>
                    <div class="summary-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 10px 0;">
                        <div class="summary-item" style="grid-column: span 2;"><strong>Curso:</strong> ${data.curso.nombre}</div>
                        <div class="summary-item"><strong>Total Horas:</strong> ${data.curso.duracion} hrs</div>
                        <div class="summary-item"><strong>Días:</strong> ${data.curso.dias_semana}</div>
                        <div class="summary-item"><strong>Inicio:</strong> ${data.curso.fecha_inicio}</div>
                        <div class="summary-item"><strong>Término:</strong> ${data.curso.fecha_termino}</div>
                        <div class="summary-item" style="grid-column: span 2;"><strong>Horario:</strong> ${data.curso.horario}</div>
                    </div>

                    <div class="btn-group-grid" style="margin-top: 25px; display: flex; gap: 10px;">
                        <button class="btn-cancel" onclick="location.reload()" style="flex:1; background-color: #95a5a6;">Corregir</button>
                        <button class="btn-confirm" onclick="window.enviarDatosBackend()" style="flex:1; background-color: #27ae60;">Registrar</button>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="instructor-container" style="display: flex; flex-direction: column; gap: 20px; align-items: center; padding: 20px;">

            <div class="card" style="max-width: 600px; width: 100%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h1 style="margin: 0;">Información del Curso</h1>
                    <span style="background: #e1f5fe; color: #0288d1; padding: 5px 12px; border-radius: 15px; font-size: 0.8rem; font-weight: bold; border: 1px solid #b3e5fc;">
                        Sección: ${tipoDeCursoActual}
                    </span>
                </div>
                <form id="instructorForm">
                    
                    <h3 style="margin-bottom: 15px; color: #555;">Datos del Instructor</h3>
                    <div class="form-group">
                        <label>Número de Empleado</label>
                        <input type="number" id="numEmpI" placeholder="Ej. 21140780" required>
                    </div>

                    <div class="form-group">
                        <label>Nombre del Instructor</label>
                        <input type="text" id="nombreI" placeholder="Nombre" required>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="form-group">
                            <label>Apellido Paterno</label>
                            <input type="text" id="paternoI" placeholder="Apellido Paterno" required>
                        </div>
                        <div class="form-group">
                            <label>Apellido Materno</label>
                            <input type="text" id="maternoI" placeholder="Apellido Materno" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Correo Electrónico</label>
                        <input 
                            type="email" 
                            id="correoI" 
                            placeholder="ejemplo@correo.com" 
                            required 
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
                            title="Por favor, introduce un correo válido con dominio (ejemplo@correo.com)"
                            required"
                        >
                    </div>

                    <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
                    <h3 style="margin-bottom: 15px; color: #555;">Datos del Curso</h3>

                    <div class="form-group">
                        <label>Nombre del Curso</label>
                        <input type="text" id="nombreC" placeholder="Nombre de la materia" required>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="form-group">
                            <label>Fecha Inicio</label>
                            <input type="date" id="fechaI" required>
                        </div>
                        <div class="form-group">
                            <label>Fecha Término</label>
                            <input type="date" id="fechaT" required>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="form-group">
                            <label>Días de la semana</label>
                            <input type="text" id="diasS" placeholder="Ej. Lunes y Miércoles" required>
                        </div>
                        <div class="form-group">
                            <label>Horario</label>
                            <input type="text" id="horarioC" placeholder="Ej. 10:00 - 12:00" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Temas</label>
                        <div id="container-temas">
                            <div class="tema-row" style="display: flex; gap: 10px; margin-bottom: 12px; align-items: center; width: 100%;">
                                <input type="text" placeholder="Título del tema" class="tema-input" required 
                                    style="flex: 5; min-width: 150px; padding: 10px;">
                                <input type="number" placeholder="Hrs" class="horas-input" min="1" required 
                                    style="flex: 1; min-width: 60px; padding: 10px; text-align: center;">
                                <button type="button" class="btn-remove-tema" 
                                        style="flex: 0.2; background: #fee2e2; border: 1px; color: #dc2626; 
                                            border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 1.2rem; 
                                            height: 38px; display: flex; align-items: center; justify-content: center;">
                                    &times;
                                </button>
                            </div>
                        </div>
                        <button type="button" id="addTema" class="btn-add" style="margin-top:10px;">+ Añadir tema</button>
                    </div>

                    <button type="submit" style="margin-top: 10px; width: 100%;">Guardar</button>
                </form>
            </div>

            <!-- SECCIÓN DE MIS CURSOS -->
            <div class="card" style="max-width: 600px; width: 100%; background: #fff;">
                <h2 style="margin-top: 0; color: #34495e;">Mis Cursos Registrados</h2>
                <div id="lista-cursos-instructor" style="max-height: 300px; overflow-y: auto; padding-right: 5px;">
                    <p>Cargando cursos...</p>
                </div>
            </div>
        </div>
    `;
}