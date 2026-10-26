import { navigate } from "../routes/router.js";
import { cursosService } from "../services/cursosService.js";

// --- GESTIÓN DE ALUMNOS EN TABLA ---
window.abrirGestionAlumnos = async (idCurso, nombreCurso) => {
    const mainContainer = document.getElementById("main-content");
    
    // 1. Renderizar estructura inicial con contenedor de tabla
    mainContainer.innerHTML = `
        <div class="card" style="max-width: 800px; margin: 20px auto; background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #2c3e50;">Gestión de Alumnos: ${nombreCurso}</h3>
            </div>
            
            <p id="loading-alumnos" style="color: #7f8c8d; text-align: center; padding: 20px;">Cargando lista de alumnos...</p>
            
            <div id="tabla-alumnos-container" style="display:none; overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
                    <thead>
                        <tr style="background-color: #2c3e50; color: white;">
                            <th style="padding: 12px 15px; text-align: center; width: 130px;">#Emp.</th>
                            <th style="padding: 12px 15px;">Nombre del Alumno</th>
                            <th style="padding: 12px 15px; text-align: center; width: 160px;">Horas Registradas</th>
                            <th style="padding: 12px 15px; text-align: center; width: 130px;">Acción</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-alumnos">
                        <!-- Se llena dinámicamente -->
                    </tbody>
                </table>
            </div>
        </div>
    `;

    try {
        const respuesta = await cursosService.obtenerAlumnosPorCurso(idCurso);
        const alumnos = respuesta.datos || [];
        const loader = document.getElementById("loading-alumnos");
        const tablaContainer = document.getElementById("tabla-alumnos-container");
        const tbody = document.getElementById("tbody-alumnos");

        if (alumnos.length === 0) {
            loader.innerText = "No hay alumnos inscritos en este curso.";
            return;
        }

        // 2. Llenar la tabla con los alumnos
        tbody.innerHTML = alumnos.map(a => `
            <tr style="border-bottom: 1px solid #eee; transition: background 0.2s;">
                <td style="padding: 12px 15px; font-weight: 500; color: #34495e;">${a.NUMERO_EMPLEADO}</td>
                <td style="padding: 12px 15px; font-weight: 500; color: #34495e;">${a.NOMBRE_COMPLETO}</td>
                <td style="padding: 10px 15px; text-align: center;">
                    <input type="number" id="horas-${a.ID_INSCRIPCION}" value="${a.HORAS_COMPLETADAS || 0}" min="0" 
                           style="width: 80px; padding: 8px; text-align: center; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;">
                </td>
                <td style="padding: 10px 15px; text-align: center;">
                    <button class="btn-actualizar-horas" data-inscripcion="${a.ID_INSCRIPCION}" 
                            style="background: #27ae60; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px;">
                        Actualizar
                    </button>
                </td>
            </tr>
        `).join('');

        loader.style.display = "none";
        tablaContainer.style.display = "block";

        // 3. Delegación de eventos para actualizar horas por cada alumno
        tbody.addEventListener("click", async (e) => {
            if (e.target.classList.contains("btn-actualizar-horas")) {
                const idInscripcion = e.target.getAttribute("data-inscripcion");
                const inputHoras = document.getElementById(`horas-${idInscripcion}`);
                const horasNuevas = inputHoras.value;

                if (!horasNuevas || horasNuevas < 0) {
                    return alert("Ingresa un número válido de horas.");
                }

                try {
                    e.target.innerText = "Guardando...";
                    e.target.disabled = true;

                    await cursosService.registrarHorasAlumno(idInscripcion, horasNuevas);
                    alert("¡Horas actualizadas correctamente!");
                } catch (err) {
                    alert("Error al guardar: " + err.message);
                } finally {
                    e.target.innerText = "Actualizar";
                    e.target.disabled = false;
                }
            }
        });

    } catch (error) {
        alert("Error al cargar alumnos: " + error.message);
    }
};

const obtenerDatosInstructor = () => {
    try {
        const usuarioGuardado = localStorage.getItem("usuario");
        if (usuarioGuardado) {
            return JSON.parse(usuarioGuardado);
        }

        const token = localStorage.getItem("token");
        if (!token) return {};
        const payloadBase64 = token.split(".")[1];
        return JSON.parse(atob(payloadBase64));
    } catch (e) {
        console.error("Error al decodificar token:", e);
        return {};
    }
};

export function instructorPage() {
    const tipoDeCursoActual = localStorage.getItem("seccion_itq") || "Docente";
    const usuarioSesion = obtenerDatosInstructor();

    const numEmpleado = usuarioSesion.id || usuarioSesion.numero_empleado || "";
    const nombre = usuarioSesion.nombre || "";
    const paterno = usuarioSesion.paterno || usuarioSesion.apellido_paterno || "";
    const materno = usuarioSesion.materno || usuarioSesion.apellido_materno || "";
    const correo = usuarioSesion.correo || usuarioSesion.email || "";

    setTimeout(() => {

        // --- LÓGICA FORMULARIO DE CURSOS ---
        const btnAdd = document.getElementById("addTema");
        const form = document.getElementById("instructorForm");
        const containerTemas = document.getElementById("container-temas");

        if (btnAdd) {
            btnAdd.addEventListener("click", () => {
                const div = document.createElement("div");
                div.className = "tema-row";
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
                
                // Obtener los días seleccionados por checkboxes
                const diasCheckboxes = document.querySelectorAll('.chk-dia:checked');
                if (diasCheckboxes.length === 0) {
                    alert("Por favor selecciona al menos un día de la semana.");
                    return;
                }
                const diasSeleccionados = Array.from(diasCheckboxes).map(cb => cb.value).join(", ");

                // Concatenar horario desde los inputs de reloj (time)
                const horaInicio = document.getElementById("horaInicio").value;
                const horaFin = document.getElementById("horaFin").value;
                if (!horaInicio || !horaFin) {
                    alert("Por favor ingresa el horario de inicio y término.");
                    return;
                }
                const horarioFormateado = `${horaInicio} - ${horaFin}`;

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
                        dias_semana: diasSeleccionados,
                        horario: horarioFormateado
                    },
                    temas: temasRaw
                };

                document.getElementById("main-content").innerHTML = renderConfirmacion();
            });
        }

        // Cargar cursos existentes
        const cargarCursos = async () => {
            const listaCursosContainer = document.getElementById("lista-cursos-instructor");
            
            if (!listaCursosContainer) {
                setTimeout(cargarCursos, 100);
                return;
            }

            try {
                const respuesta = await cursosService.obtenerMisCursos();
                const listaFinal = respuesta.datos || [];

                if (listaFinal.length === 0) {
                    listaCursosContainer.innerHTML = `
                        <div style="text-align:center; padding: 20px; color: #666; background: #f9f9f9; border-radius: 8px;">
                            No hay cursos asignados o registrados aún.
                        </div>`;
                    return;
                }

                listaCursosContainer.innerHTML = listaFinal.map(curso => `
                    <div class="curso-card-mini" style="background: white; padding: 9px; border-radius: 8px; border-left: 5px solid #2c3e50; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h4 style="margin: 0 0 5px 0; color: #2c3e50;">${curso.NOMBRE_CURSO}</h4>
                            <div style="font-size: 0.85rem; color: #666;">
                                <span><strong>Modalidad:</strong> ${curso.TIPO_CURSO || 'General'}</span><br>
                                <span><strong>Instructor:</strong> ${curso.INSTRUCTOR}</span><br>
                                <span><strong>Horas Totales:</strong> ${curso.TOTAL_HORAS}</span> |
                                <span><strong>Días:</strong> ${curso.DIAS_SEMANA || 'No especificado'}</span>
                            </div>
                        </div>
                        <button class="btn-alumnos" 
                            data-id="${curso.ID_CURSO}" 
                            data-nombre="${curso.NOMBRE_CURSO}"
                            style="background: #2c3e50; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; width: auto; min-width: 100px; font-size: 0.85rem; white-space: nowrap;">
                            Alumnos
                        </button>
                    </div>
                `).join('');

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
                location.reload();
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    function renderConfirmacion() {
        const data = window.tempInstructorData;
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
                        <input type="number" id="numEmpI" value="${numEmpleado}" placeholder="Ej. 21140780" required>
                    </div>

                    <div class="form-group">
                        <label>Nombre del Instructor</label>
                        <input type="text" id="nombreI" value="${nombre}" placeholder="Nombre" required>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="form-group">
                            <label>Apellido Paterno</label>
                            <input type="text" id="paternoI" value="${paterno}" placeholder="Apellido Paterno" required>
                        </div>
                        <div class="form-group">
                            <label>Apellido Materno</label>
                            <input type="text" id="maternoI" placeholder="Apellido Materno" value="${materno}" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Correo Electrónico</label>
                        <input 
                            type="email" 
                            id="correoI" 
                            value="${correo}"
                            placeholder="ejemplo@correo.com" 
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
                            title="Por favor, introduce un correo válido con dominio (ejemplo@correo.com)"
                            required
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

                    <!-- DÍAS DE LA SEMANA CON CHECKBOXES TIPO BOTÓN -->
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label style="display:block; margin-bottom: 8px;">Días de Impartición</label>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            ${[
                                { label: "L", value: "Lunes" },
                                { label: "M", value: "Martes" },
                                { label: "Mi", value: "Miércoles" },
                                { label: "J", value: "Jueves" },
                                { label: "V", value: "Viernes" },
                                { label: "S", value: "Sábado" },
                                { label: "D", value: "Domingo" }
                            ].map(d => `
                                <label style="display: flex; align-items: center; justify-content: center; background: #f0f3f6; border: 1px solid #ccc; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px; color: #34495e; user-select: none;">
                                    <input type="checkbox" class="chk-dia" value="${d.value}" style="margin-right: 5px; cursor: pointer;">
                                    ${d.label}
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <!-- HORARIO CON RELOJES (input type="time") -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="form-group">
                            <label>Hora de Inicio</label>
                            <input type="time" id="horaInicio" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                        </div>
                        <div class="form-group">
                            <label>Hora de Término</label>
                            <input type="time" id="horaFin" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                        </div>
                    </div>

                    <div class="form-group" style="margin-top: 15px;">
                        <label>Temas</label>
                        <div id="container-temas">
                            <div class="tema-row" style="display: flex; gap: 10px; margin-bottom: 12px; align-items: center; width: 100%;">
                                <input type="text" placeholder="Título del tema" class="tema-input" required 
                                    style="flex: 5; min-width: 150px; padding: 10px;">
                                <input type="number" placeholder="Hrs" class="horas-input" min="1" required 
                                    style="flex: 1; min-width: 60px; padding: 10px; text-align: center;">
                                <button type="button" class="btn-remove-tema" 
                                        style="flex: 0.2; background: #fee2e2; border: 1px solid #f87171; color: #dc2626; 
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