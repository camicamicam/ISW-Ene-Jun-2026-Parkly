import { cursosService } from "../services/cursosService.js";
import { inscripcionesService } from "../services/inscripcionesService.js";
import { Loader } from "../components/loader.js";

export function administrativoPage() {
    // Aquí replicamos la lógica de docente.js
    // Si no hay nada en el storage, para esta página el default es "Profesional"
    const tipoDeCursoActual = localStorage.getItem("seccion_itq") || "Profesional";
    let cursoSeleccionadoId = null;

    // Departamentos específicos para administrativos
    const departamentos = [
        { id: 22, nombre: "Ciencias Económico Administrativas" },
        { id: 23, nombre: "Desarrollo Académico" },
        { id: 24, nombre: "División de Estudios Profesionales" },
        { id: 35, nombre: "División Posgrado e Investigación" },
        { id: 26, nombre: "Ingeniería Eléctrica y Electrónica" },
        { id: 27, nombre: "Ingeniería Industrial" },
        { id: 28, nombre: "Metal Mecánica" },
        { id: 29, nombre: "Sistemas y Computación" },
        { id: 21, nombre: "Ciencias Básicas" }
    ];

    setTimeout(() => {
        const gridCursos = document.getElementById("grid-cursos-inscripcion");
        const form = document.getElementById("adminForm");

        // 1. CARGAR CURSOS EN FORMATO TARJETA (Igual que en docente.js)
        const cargarTarjetasCursos = async () => {
            if (!gridCursos) return;

            try {
                // Usamos la misma lógica de servicio que docente.js
                const respuesta = await cursosService.obtenerCursosDisponibles(tipoDeCursoActual);
                const listaFinal = respuesta.datos || [];

                if (listaFinal.length === 0) {
                    gridCursos.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding:20px;">No hay cursos disponibles para ${tipoDeCursoActual}.</p>`;
                    return;
                }

                gridCursos.innerHTML = listaFinal.map(curso => `
                    <div class="curso-card-horizontal" data-id="${curso.ID_CURSO}" id="card-${curso.ID_CURSO}">
                        <div class="card-content">
                            <span class="badge-horas">${curso.TOTAL_HORAS} Hrs</span>
                            <h4 class="curso-titulo">${curso.NOMBRE_CURSO}</h4>
                            <div class="curso-detalles">
                                <p><strong>Instructor:</strong> ${curso.INSTRUCTOR}</p>
                                <p><strong>Días:</strong> ${curso.DIAS_SEMANA || 'No especificado'}</p>
                                <p><strong>Horario:</strong> ${curso.HORARIO || 'No especificado'}</p>
                            </div>
                        </div>
                        <div class="card-action">
                            <button type="button" class="btn-seleccionar">Seleccionar</button>
                        </div>
                    </div>
                `).join('');

                window.cursosCache = listaFinal;

                document.querySelectorAll('.curso-card-horizontal').forEach(card => {
                    card.addEventListener('click', () => {
                        document.querySelectorAll('.curso-card-horizontal').forEach(c => {
                            c.classList.remove('selected');
                            c.querySelector('.btn-seleccionar').textContent = "Seleccionar";
                        });

                        card.classList.add('selected');
                        card.querySelector('.btn-seleccionar').textContent = "Seleccionado ✓";
                        cursoSeleccionadoId = card.getAttribute('data-id');

                        const sectionRegistro = document.getElementById('registro-seccion');
                        sectionRegistro.style.display = 'block';
                        sectionRegistro.scrollIntoView({ behavior: 'smooth' });
                    });
                });

            } catch (error) {
                gridCursos.innerHTML = `<p style="color:red;">Error al cargar los cursos.</p>`;
            }
        };

        cargarTarjetasCursos();

        // 2. MANEJO DEL FORMULARIO (Sin id_plaza)
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                if (!cursoSeleccionadoId) {
                    alert("Por favor, selecciona un curso.");
                    return;
                }

                const cursoInfo = window.cursosCache.find(c => c.ID_CURSO == cursoSeleccionadoId);

                window.tempInscripcionData = {
                    numero_empleado: Number(document.getElementById("numEmpA").value),
                    nombre: document.getElementById("nombreA").value.trim(),
                    apellido_paterno: document.getElementById("paternoA").value.trim(),
                    apellido_materno: document.getElementById("maternoA").value.trim(),
                    correo: document.getElementById("correoA").value.trim(),
                    id_departamento: Number(document.getElementById("deptoSelectA").value),
                    id_curso: Number(cursoSeleccionadoId),
                    nombreCursoVisual: cursoInfo.NOMBRE_CURSO
                };

                document.getElementById("main-content").innerHTML = renderConfirmacion();
            });
        }
    }, 0);

    window.confirmarInscripcionFinal = async () => {
        Loader.show();
        try {
            const { nombreCursoVisual, ...payload } = window.tempInscripcionData;
            // Aquí enviamos a la ruta administrativo
            await inscripcionesService.inscribir(payload, "administrativo");
            alert("¡Inscripción Exitosa!");
            location.reload();
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            Loader.hide();
        }
    };

    function renderConfirmacion() {
        const d = window.tempInscripcionData;
        return `
            <div class="docente-container">
                <div class="card summary-card" style="border-top: 10px solid #27ae60; max-width: 500px;">
                    <h2>Confirmar Registro Administrativo</h2>
                    <div class="summary-item"><strong>Curso:</strong> <span>${d.nombreCursoVisual}</span></div>
                    <div class="summary-item"><strong>N° Empleado:</strong> <span>${d.numero_empleado}</span></div>
                    <div class="btn-group-grid" style="margin-top:20px;">
                        <button class="btn-cancel" onclick="location.reload()">Corregir</button>
                        <button class="btn-confirm" style="background:#27ae60" onclick="window.confirmarInscripcionFinal()">Finalizar</button>
                    </div>
                </div>
            </div>`;
    }

    return `
        <div class="docente-main-wrapper" style="padding: 40px 20px; background: rgba(39, 174, 96, 0.05); min-height: 100vh;">
            <div style="max-width: 1000px; margin: auto;">
                <h1 style="text-align: center; color: #27ae60;">Oferta Educativa (${tipoDeCursoActual})</h1>
                
                <div id="grid-cursos-inscripcion" class="cursos-grid-inscripcion">
                    <p>Cargando cursos...</p>
                </div>

                <div id="registro-seccion" style="display:none; margin-top: 50px;">
                    <div class="card" style="max-width: 600px; margin: auto; border-top: 5px solid #3498db;">
                        <h3>Datos Personales Administrativo</h3>
                        <form id="adminForm">
                            <div class="form-group"><label>N° Empleado</label><input type="number" id="numEmpA" required></div>
                            <div class="form-group"><label>Nombre(s)</label><input type="text" id="nombreA" required></div>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                                <div class="form-group"><label>Ap. Paterno</label><input type="text" id="paternoA" required></div>
                                <div class="form-group"><label>Ap. Materno</label><input type="text" id="maternoA" required></div>
                            </div>
                            <div class="form-group"><label>Correo Institucional</label><input type="email" id="correoA" required></div>
                            <div class="form-group">
                                <label>Departamento</label>
                                <select id="deptoSelectA" required>
                                    ${departamentos.map(d => `<option value="${d.id}">${d.nombre}</option>`).join('')}
                                </select>
                            </div>
                            <button type="submit" class="btn-confirm" style="background:#27ae60; margin-top:20px;">Revisar y Enviar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}