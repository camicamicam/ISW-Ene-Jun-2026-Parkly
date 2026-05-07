import { inscripcionesService } from "../services/inscripcionesService.js";
import { Loader } from "../components/loader.js";

export function docentePage() {
    const tipoDeCursoActual = localStorage.getItem("seccion_itq") || "Docente";
    let cursoSeleccionadoId = null;

    const plazas = [
        { id: 1, nombre: "TC (Tiempo Completo)" },
        { id: 21, nombre: "3/4 de Tiempo" },
        { id: 2, nombre: "1/2 Tiempo" },
        { id: 22, nombre: "Asignatura" },
        { id: 3, nombre: "Honorarios" }
    ];

    const departamentos = [
        { id: 26, nombre: "Ingeniería Eléctrica y Electrónica"},
        { id: 27, nombre: "Ingeniería Industrial"},
        { id: 28, nombre: "Metal Mecánica"},
        { id: 29, nombre: "Sistemas y Computación"},
        { id: 21, nombre: "Ciencias Básicas"}
    ];

    setTimeout(() => {
        const gridCursos = document.getElementById("grid-cursos-inscripcion");
        const form = document.getElementById("docenteForm");

        // 1. CARGAR CURSOS EN FORMATO TARJETA
        const cargarTarjetasCursos = async () => {
            if (!gridCursos) return;

            try {
                // Llamamos al catálogo público (este NO recibe parámetros según tu service)
                const respuesta = await inscripcionesService.obtenerCatalogoPublico(tipoDeCursoActual);
                // 2. Extraemos los datos (usamos el nombre 'listaFiltrada' para no romper el resto del código)
                const listaFiltrada = respuesta.datos || respuesta || [];

                // 3. Validamos si hay cursos
                if (listaFiltrada.length === 0) {
                    gridCursos.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding:20px;">No hay cursos disponibles para la sección ${tipoDeCursoActual}.</p>`;
                    return;
                }

                // Renderizamos usando la lista filtrada
                gridCursos.innerHTML = listaFiltrada.map(curso => `
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

                // Guardamos en el caché la lista filtrada para el formulario de registro
                window.cursosCache = listaFiltrada;

                // Re-vinculamos los eventos de click
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
                console.error("Error visualizando tarjetas:", error);
                gridCursos.innerHTML = `<p style="color:red; text-align:center;">Error al cargar los cursos públicos.</p>`;
            }
        };

        cargarTarjetasCursos();

        // 2. MANEJO DEL FORMULARIO
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                if (!cursoSeleccionadoId) {
                    alert("Por favor, selecciona un curso de la lista superior.");
                    return;
                }

                const cursoInfo = window.cursosCache.find(c => c.ID_CURSO == cursoSeleccionadoId);

                window.tempInscripcionData = {
                    // Forzamos que sean números puros
                    numero_empleado: Number(document.getElementById("numEmp").value),
                    nombre: document.getElementById("nombreD").value.trim(),
                    apellido_paterno: document.getElementById("paternoD").value.trim(),
                    apellido_materno: document.getElementById("maternoD").value.trim(),
                    correo: document.getElementById("correoD").value.trim(),
                    
                    // IMPORTANTE: Asegúrate de que los select tengan valores válidos
                    id_departamento: Number(document.getElementById("deptoSelect").value), 
                    id_plaza: Number(document.getElementById("plazaSelect").value),
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
            const data = await inscripcionesService.inscribir(payload);
            alert(data.mensaje || "¡Inscripción exitosa!");
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
                <div class="card summary-card" style="border-top: 10px solid #2c3e50; max-width: 500px;">
                    <h2 style="margin-bottom:20px;">Confirmar Registro</h2>
                    <div class="summary-item"><strong>Curso:</strong> <span>${d.nombreCursoVisual}</span></div>
                    <div class="summary-item"><strong>Docente:</strong> <span>${d.nombre} ${d.apellido_paterno}</span></div>
                    <div class="summary-item"><strong>N° Empleado:</strong> <span>${d.numero_empleado}</span></div>
                    <div class="btn-group-grid" style="margin-top:20px;">
                        <button class="btn-cancel" onclick="location.reload()">Corregir</button>
                        <button class="btn-confirm" onclick="window.confirmarInscripcionFinal()">Finalizar</button>
                    </div>
                </div>
            </div>`;
    }

    return `
        <div class="docente-main-wrapper" style="padding: 40px 20px; background: rgba(44, 62, 80, 0.05); min-height: 100vh;">
            <div style="max-width: 1000px; margin: auto;">
                <h1 style="text-align: center; color: #2c3e50; margin-bottom: 10px;">Oferta Educativa (${tipoDeCursoActual})</h1>
                <p style="text-align: center; color: #7f8c8d; margin-bottom: 30px;">Selecciona el curso de tu interés para comenzar tu inscripción.</p>
                
                <div id="grid-cursos-inscripcion" class="cursos-grid-inscripcion">
                    <p>Cargando oferta educativa...</p>
                </div>

                <div id="registro-seccion" style="display:none; margin-top: 50px; animation: fadeIn 0.5s ease;">
                    <div class="card" style="max-width: 600px; margin: auto; border-top: 5px solid #3498db;">
                        <h3>Datos Personales del Docente</h3>
                        <form id="docenteForm">
                            <div class="form-group"><label>N° Empleado</label><input type="number" id="numEmp" required></div>
                            <div class="form-group"><label>Nombre(s)</label><input type="text" id="nombreD" required></div>
                            <div class="name-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                                <div class="form-group"><label>Ap. Paterno</label><input type="text" id="paternoD" required></div>
                                <div class="form-group"><label>Ap. Materno</label><input type="text" id="maternoD" required></div>
                            </div>
                            <div class="form-group"><label>Correo Institucional</label><input type="email" id="correoD" required></div>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                                <div class="form-group">
                                    <label>Plaza</label>
                                    <select id="plazaSelect" required>${plazas.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('')}</select>
                                </div>
                                <div class="form-group">
                                    <label>Departamento</label>
                                    <select id="deptoSelect" required>${departamentos.map(d => `<option value="${d.id}">${d.nombre}</option>`).join('')}</select>
                                </div>
                            </div>
                            <button type="submit" class="btn-confirm" style="margin-top:20px;">Revisar y Enviar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}