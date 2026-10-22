import { cursosService } from "../services/cursosService.js";
import { instructoresService } from "../services/instructoresService.js";
import { Loader } from "../components/loader.js";

// VARIABLES DE ESTADO LOCAL
let cursosLocales = []; 
let cursoSeleccionado = null; 
let temasEditados = []; 
let tipoCursoActual = "Profesional"; 
let vistaActualAdmin = "cursos"; // <-- "cursos" o "instructores"

function generarPassword(longitud = 12){
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
    let password = "";

    for(let i = 0; i < longitud; i++){
        const randomIndex = Math.floor(Math.random() * caracteres.length);
        password += caracteres[randomIndex];
    }

    return password;
}
export async function adminCursosPage(tipoCurso = null) {
    if (!tipoCurso) {
        tipoCurso = localStorage.getItem("seccion_itq") || "Profesional";
    }

    cursoSeleccionado = null; 
    tipoCursoActual = tipoCurso; 

    console.log("=> Cargando panel de administración general. Vista:", vistaActualAdmin);

    if (!window.adminCursosInitialized) {
        setupAdminEvents();
        window.adminCursosInitialized = true;
    }

    // Solo hacemos la petición de cursos si estamos en la pestaña de cursos
    if (vistaActualAdmin === "cursos") {
        try {
            Loader.show();
            const respuesta = await cursosService.obtenerCursosDisponibles(tipoCursoActual);
            
            if (Array.isArray(respuesta)) {
                cursosLocales = respuesta;
            } else if (respuesta && Array.isArray(respuesta.datos)) { 
                cursosLocales = respuesta.datos; 
            } else {
                cursosLocales = []; 
            }
        } catch (err) {
            console.error("No se pudieron cargar los cursos admin", err);
            cursosLocales = []; 
        } finally {
            Loader.hide();
        }
    }

    return renderizarInterfazGlobal();
}

function renderizarInterfazGlobal() {
    return `
        <div class="admin-container" style="display: flex; flex-direction: column; align-items: center; width: 100%; padding: 30px 20px; gap: 20px; background: rgba(44, 62, 80, 0.05); font-family: 'Segoe UI', Roboto, sans-serif;">
            
            <div style="width: 100%; max-width: 900px; display: flex; background: white; border-radius: 8px; padding: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); gap: 10px;">
                <button id="tab-vistas-cursos" style="flex: 1; padding: 12px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.3s; background: ${vistaActualAdmin === 'cursos' ? '#2c3e50' : 'transparent'}; color: ${vistaActualAdmin === 'cursos' ? 'white' : '#7f8c8d'};">
                    Gestionar Cursos (${tipoCursoActual}es)
                </button>
                <button id="tab-vistas-instructores" style="flex: 1; padding: 12px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.3s; background: ${vistaActualAdmin === 'instructores' ? '#2c3e50' : 'transparent'}; color: ${vistaActualAdmin === 'instructores' ? 'white' : '#7f8c8d'};">
                    Registrar Instructor
                </button>
                <button id="tab-consultar-instructores" style="flex: 1; padding: 12px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.3s; background: ${vistaActualAdmin === 'consultar' ? '#2c3e50' : 'transparent'}; color: ${vistaActualAdmin === 'consultar' ? 'white' : '#7f8c8d'};">
                    Consultar Instructor
                </button>
            </div>

            <div style="width: 100%; max-width: 900px;">
                ${
                    {
                        "cursos": renderizarSeccionCursos(),
                        "instructores": renderizarSeccionInstructores(),
                        "consultar": renderizarSeccionConsulta()
                    }[vistaActualAdmin] || "<div>Vista no válida</div>"
                }
            </div>
        </div>
    `;
}

// VISTA A: GESTIÓN DE CURSOS
function renderizarSeccionCursos() {
    return `
        <div style="width: 100%; text-align: left; margin-bottom: 20px;">
            <h1 style="text-align: center; color: #2c3e50; margin-bottom: 5px; font-size: 26px;">Panel de Administración de Cursos</h1>
            <p style="color: #7f8c8d; text-align:center; margin: 0;">Selecciona un curso de la lista para actualizar sus datos o eliminarlo de la plataforma.</p>
        </div>

        <div style="display: grid; grid-template-columns: ${cursoSeleccionado ? '1fr 1fr' : '1fr'}; width: 100%; gap: 30px;" id="admin-layout">
            
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <h3 style="margin-bottom: 15px; color: #2c3e50; margin-top:0;">Cursos Disponibles</h3>
                <div id="grid-cursos-inscripcion">
                    ${cursosLocales.length === 0 ? '<p style="color: #7f8c8d; text-align:center; padding:20px;">No hay cursos registrados en el sistema.</p>' : ''}
                    ${cursosLocales.map(c => `
                        <div class="curso-card-horizontal ${cursoSeleccionado?.ID_CURSO === c.ID_CURSO ? 'selected' : ''}" style="border: 1px solid #eee; padding: 15px; border-radius: 8px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; background: white;">
                            <div class="card-content">
                                <span class="badge-horas" style="background: #34495e; color: white; padding: 3px 8px; border-radius: 4px; font-size: 12px;">${c.HORARIO || 'Horario no asignado'}</span>
                                <h4 class="curso-titulo" style="margin: 10px 0 5px 0; color: #2c3e50;">${c.NOMBRE_CURSO}</h4>
                                <div class="curso-detalles" style="font-size: 13px; color: #555;">
                                    <p style="margin: 2px 0;"><strong>Instructor:</strong> ${c.INSTRUCTOR}</p>
                                    <p style="margin: 2px 0;"><strong>Cupo Máximo:</strong> ${c.CUPO_MAXIMO} alumnos</p>
                                    <p style="margin: 2px 0;"><strong>Periodo / Año:</strong> Periodo ${c.PERIODO} - 20${c.ANIO}</p>
                                    <p style="margin: 2px 0;"><strong>Días:</strong> ${c.DIAS_SEMANA}</p>
                                </div>
                            </div>
                            <div class="card-action" style="display: flex; flex-direction: column; gap: 8px;">
                                <button class="btn-seleccionar btn-editar-trigger" data-id="${c.ID_CURSO}" style="padding: 8px 15px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Editar</button>
                                <button class="btn-cancel btn-eliminar-trigger" data-id="${c.ID_CURSO}" style="padding: 8px 15px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">Eliminar</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div id="contenedor-formulario-edicion" style="display: ${cursoSeleccionado ? 'block' : 'none'}; background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 8px solid #34495e;">
                <h3 style="margin-bottom: 20px; color: #2c3e50; margin-top:0;">Modificar Datos del Curso</h3>
                
                <form id="form-actualizar-curso">
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label style="display:block; margin-bottom:5px; font-size:14px; font-weight:600;">Nombre del Curso</label>
                        <input type="text" id="edit-nombre" value="${cursoSeleccionado?.NOMBRE_CURSO || ''}" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px; box-sizing: border-box;" required>
                    </div>

                    <div style="display:flex; gap:15px; margin-bottom: 15px;">
                        <div style="flex:1;">
                            <label style="display:block; margin-bottom:5px; font-size:14px; font-weight:600;">Cupo Máximo</label>
                            <input type="number" id="edit-cupo" value="${cursoSeleccionado?.CUPO_MAXIMO || ''}" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px; box-sizing: border-box;" required>
                        </div>
                        <div style="flex:1;">
                            <label style="display:block; margin-bottom:5px; font-size:14px; font-weight:600;">Año (AA)</label>
                            <input type="number" id="edit-anio" value="${cursoSeleccionado?.ANIO || ''}" placeholder="Ej: 26" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px; box-sizing: border-box;" required>
                        </div>
                    </div>

                    <div style="display:flex; gap:15px; margin-bottom: 15px;">
                        <div style="flex:1;">
                            <label style="display:block; margin-bottom:5px; font-size:14px; font-weight:600;">Periodo</label>
                            <input type="number" id="edit-periodo" value="${cursoSeleccionado?.PERIODO || ''}" placeholder="Ej: 1" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px; box-sizing: border-box;" required>
                        </div>
                        <div style="flex:1;">
                            <label style="display:block; margin-bottom:5px; font-size:14px; font-weight:600;">Horario</label>
                            <input type="text" id="edit-horario" value="${cursoSeleccionado?.HORARIO || ''}" placeholder="Ej: 10:00 - 12:00" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px; box-sizing: border-box;" required>
                        </div>
                    </div>

                    <div style="display:flex; gap:15px; margin-bottom: 15px;">
                        <div style="flex:1;">
                            <label style="display:block; margin-bottom:5px; font-size:14px; font-weight:600;">Fecha de Inicio</label>
                            <input type="date" id="edit-fecha-inicio" value="${cursoSeleccionado?.FECHA_INICIO ? cursoSeleccionado.FECHA_INICIO.substring(0,10) : ''}" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px; box-sizing: border-box;" required>
                        </div>
                        <div style="flex:1;">
                            <label style="display:block; margin-bottom:5px; font-size:14px; font-weight:600;">Fecha de Término</label>
                            <input type="date" id="edit-fecha-termino" value="${cursoSeleccionado?.FECHA_TERMINO ? cursoSeleccionado.FECHA_TERMINO.substring(0,10) : ''}" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px; box-sizing: border-box;" required>
                        </div>
                    </div>

                    <div class="form-group" style="margin-bottom: 15px;">
                        <label style="display:block; margin-bottom:5px; font-size:14px; font-weight:600;">Días de la Semana</label>
                        <input type="text" id="edit-dias" value="${cursoSeleccionado?.DIAS_SEMANA || ''}" placeholder="Ej: Lunes y Miércoles" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px; box-sizing: border-box;" required>
                    </div>

                    <div style="margin-top: 25px;">
                        <label style="font-weight: bold; color: #2c3e50; font-size: 14px; display: block; margin-bottom: 8px;">Temas del Curso</label>
                        <div id="lista-temas-dinamicos">
                            ${temasEditados.map((t, index) => {
                                const tituloVal = t.TITULO_TEMA || t.titulo_tema || '';
                                const horasVal = t.HORAS_TEMA !== undefined ? t.HORAS_TEMA : (t.horas_tema || t.horas_duracion || '');
                                return `
                                    <div class="tema-row" style="display: flex; gap: 10px; margin-bottom: 12px; align-items: center; width: 100%;">
                                        <input type="text" class="input-tema-titulo" placeholder="Título del tema" value="${tituloVal}" style="flex: 5; padding: 10px; border:1px solid #ccc; border-radius:4px;" required>
                                        <input type="number" class="input-tema-horas" placeholder="Hrs" value="${horasVal}" style="flex: 1; padding: 10px; text-align: center; border:1px solid #ccc; border-radius:4px;" min="1" required>
                                        <button type="button" class="btn-remover-tema" data-index="${index}" style="width: 38px; height: 38px; background: #fee2e2; border: 1px solid #f87171; color: #dc2626; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; padding:0;">&times;</button>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <button type="button" id="btn-agregar-tema-edit" class="btn-add" style="padding: 8px 15px; background: #2ecc71; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">+ Agregar Tema</button>
                    </div>

                    <div style="display: flex; gap: 15px; margin-top: 25px;">
                        <button type="submit" style="flex: 1; padding: 10px; background: #2c3e50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Guardar Cambios</button>
                        <button type="button" id="btn-cancelar-edicion" style="flex: 1; padding: 10px; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// VISTA B: REGISTRO DE INSTRUCTORES
function renderizarSeccionInstructores() {
    return `
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-top: 8px solid #2c3e50; width: 100%; box-sizing: border-box;">
            <div style="text-align: center; margin-bottom: 25px;">
                <h2 style="color: #2c3e50; margin: 0 0 5px 0; font-size: 24px;">Alta de Instructores</h2>
                <p style="color: #7f8c8d; margin: 0; font-size: 14px;">Ingresa los datos para registrar un nuevo instructor en el sistema del ITQ.</p>
            </div>

            <form id="form-registrar-instructor" style="display: flex; flex-direction: column; gap: 18px;">
                <div style="display: flex; gap: 15px;">
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #34495e; font-size: 14px;">Número de Empleado</label>
                        <input type="number" id="inst-numero" placeholder="Ej: 5555" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box;" required>
                    </div>
                    <div style="flex: 2;">
                        <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #34495e; font-size: 14px;">Nombre(s)</label>
                        <input type="text" id="inst-nombre" placeholder="Ej: Roberto" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box;" required>
                    </div>
                </div>

                <div style="display: flex; gap: 15px;">
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #34495e; font-size: 14px;">Apellido Paterno</label>
                        <input type="text" id="inst-paterno" placeholder="Ej: Méndez" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box;" required>
                    </div>
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #34495e; font-size: 14px;">Apellido Materno</label>
                        <input type="text" id="inst-materno" placeholder="Ej: Ruiz" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box;" required>
                    </div>
                </div>

                <div>
                    <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #34495e; font-size: 14px;">Correo electrónico</label>
                    <input type="email" id="inst-correo" placeholder="ejemplo@gmail.com" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box;" required>
                </div>

                <div>
                    <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #34495e; font-size: 14px;">Contraseña de Acceso</label>
                    <div class="input-container">
                        <input type="password" id="inst-password" placeholder="Haz clic en Generar" style="flex: 1; border: none; padding: 10px 0; outline: none; background: transparent;" required>
                        <i id="toggle-pass" class="fa-solid fa-eye" style="cursor: pointer; color: #7f8c8d; font-size: 1.2rem; padding: 0 5px;" title="Ver/Ocultar contraseña"></i>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button type="button" id="btnGenerar" style="flex: 1; padding: 10px 15px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600;">Generar</button>
                        <button type="button" id="btnCopiar" style="flex: 1; padding: 10px 15px; background: #95a5a6; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600;">Copiar</button>
                    </div>
                </div>
                <div style="margin-top: 10px; display: flex; justify-content: center;">
                    <button type="submit" style="padding: 12px 40px; background: #27ae60; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 15px; transition: 0.2s; width: 100%; max-width: 300px;">
                     Registrar Instructor
                    </button>
                </div>
            </form>
        </div>
    `;
}

function renderizarSeccionConsulta(){
    return `
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-top: 8px solid #2c3e50; width: 100%; box-sizing: border-box;">
            <div style="text-align: center; margin-bottom: 25px;">
                <h2 style="color: #2c3e50; margin: 0 0 5px 0; font-size: 24px;">Directorio de Instructores</h2>
                <p style="color: #7f8c8d; margin: 0; font-size: 14px;">Consulta y gestiona los instructores registrados en la plataforma.</p>
            </div>

            <!--BARRA DE BÚSQUEDA-->
            <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                <div style="flex: 3; min-width: 250px; position: relative;">
                    <input type="text" id="input-buscar-instructor" placeholder="Buscar por nombre o apellidos" 
                            style="width: 100%; padding: 10px 12px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; font-size: 14px; outline: none;">
                </div>

                <div style="flex: 1; min-width: 160px;">
                    <select id="select-filtro-estado" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; font-size: 14px; background: white; color: #333;">
                        <option value="todos">Todos los estados</option>
                        <option value="activo">Activos</option>
                        <option value="inactivo">Inactivos</option>
                    </select>
                </div>
            </div>

            <!--TABLA DE DATOS-->
            <div style="overflow-x: auto; border: 1px solid #eee; border-radius: 8px;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
                    <thead>
                        <tr style="background-color: #2c3e50; color: white;">
                            <th style="padding: 12px 15px;">N° Empleado</th>
                            <th style="padding: 12px 15px;">Nombre Completo</th>
                            <th style="padding: 12px 15px;">Correo Electrónico</th>
                            <th style="padding: 12px 15px; text-align: center;">Estado</th>
                            <th style="padding: 12px 15px; text-align: center;">Acciones</th>
                        </tr>
                    </thead>

                    <tbody id="tabla-instructores-body">
                        <!-- Fila de ejemplo 1 -->
                        <tr style="border-bottom: 1px solid #eee; transition: 0.2s;">
                            <td style="padding: 12px 15px; font-weight: 600; color: #34495e;">21140780</td>
                            <td style="padding: 12px 15px;">Camila Mata García</td>
                            <td style="padding: 12px 15px; color: #555;">camila.mata@queretaro.tecnm.mx</td>
                            <td style="padding: 12px 15px; text-align: center;">
                                <span style="background: #d4edda; color: #155724; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">Activo</span>
                            </td>
                            <td style="padding: 12px 15px; text-align: center;">
                                <button type="button" class="btn-ver-instructor" data-id="21140780" style="padding: 5px 10px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">📄 Detalle</button>
                            </td>
                        </tr>

                        <!-- Fila de ejemplo 2 -->
                        <tr style="border-bottom: 1px solid #eee; transition: 0.2s; background-color: #f9f9f9;">
                            <td style="padding: 12px 15px; font-weight: 600; color: #34495e;">55551234</td>
                            <td style="padding: 12px 15px;">Roberto Méndez Ruiz</td>
                            <td style="padding: 12px 15px; color: #555;">roberto.mendez@queretaro.tecnm.mx</td>
                            <td style="padding: 12px 15px; text-align: center;">
                                <span style="background: #d4edda; color: #155724; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">Activo</span>
                            </td>
                            <td style="padding: 12px 15px; text-align: center;">
                                <button type="button" class="btn-ver-instructor" data-id="55551234" style="padding: 5px 10px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">📄 Detalle</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 10px; font-size: 13px; color: #7f8c8d;">
                <span>Mostrando 2 de 2 instructores registrados</span>
                
                <div style="display: flex; gap: 5px;">
                    <button type="button" style="padding: 5px 10px; border: 1px solid #ccc; background: #f8f9fa; border-radius: 6px; cursor: pointer; color: #555;" disabled>Anterior</button>
                    <button type="button" style="padding: 5px 10px; border: 1px solid #ccc; background: #2c3e50; color: white; border-radius: 4px; cursor: pointer;">1</button>
                    <button type="button" style="padding: 5px 10px; border: 1px solid #ccc; background: #f8f9fa; border-radius: 6px; cursor: pointer; color: #555;" disabled>Siguiente</button>
                </div>
            </div>

        </div>  
    `
}

function setupAdminEvents() {
    const mainContent = document.getElementById("main-content");

    mainContent.addEventListener("click", async (e) => {
        // MANEJO DE CAMBIO DE PESTAÑAS (TABS)
        if (e.target.id === "tab-vistas-cursos" && vistaActualAdmin !== "cursos") {
            vistaActualAdmin = "cursos";
            mainContent.innerHTML = await adminCursosPage(tipoCursoActual);
        }
        if (e.target.id === "tab-vistas-instructores" && vistaActualAdmin !== "instructores") {
            vistaActualAdmin = "instructores";
            mainContent.innerHTML = await adminCursosPage(tipoCursoActual);
        }

        if (e.target.id === "tab-consultar-instructores" && vistaActualAdmin !== "consultar") {
            vistaActualAdmin = "consultar";
            mainContent.innerHTML = await adminCursosPage(tipoCursoActual);
        }

        // GENERAR CONTRASEÑA
        if (e.target.id === "btnGenerar") {
            const nuevaPassword = generarPassword(12);
            const inputPass = document.getElementById("inst-password");
            if (inputPass) {
                inputPass.value = nuevaPassword;
            }
        }

        //CAMBIAR ICONO VISUALIZAR CONTRASEÑA

        if (e.target.id === "toggle-pass") {
            const inputPass = document.getElementById("inst-password");
            if (inputPass) {
                const esPassword = inputPass.type === "password";
                inputPass.type = esPassword ? "text" : "password";
                e.target.classList.toggle("fa-eye", !esPassword);
                e.target.classList.toggle("fa-eye-slash", esPassword);
            }
        }

        //COPIAR CONTRASEÑA
        if (e.target.id === "btnCopiar") {
            const inputPass = document.getElementById("inst-password");
            if (inputPass && inputPass.value) {
                navigator.clipboard.writeText(inputPass.value);
                alert("¡Contraseña copiada al portapapeles!");
            } else {
                alert("Primero genera una contraseña para poder copiarla.");
            }
        }

        // CONTROL DE CURSOS (EDITAR / ELIMINAR / TEMAS)
        if (e.target.classList.contains("btn-editar-trigger")) {
            const id = Number(e.target.getAttribute("data-id"));
            cursoSeleccionado = cursosLocales.find(c => c.ID_CURSO === id);
            if (cursoSeleccionado) {
                temasEditados = cursoSeleccionado.TEMAS || cursoSeleccionado.temas || [];
                mainContent.innerHTML = renderizarInterfazGlobal();
            }
        }

        if (e.target.classList.contains("btn-eliminar-trigger")) {
            const id = Number(e.target.getAttribute("data-id"));
            if (confirm("¿Estás seguro de eliminar este curso?")) {
                try {
                    Loader.show();
                    await cursosService.eliminarCurso(id);
                    alert("Curso eliminado del catálogo.");
                    cursosLocales = cursosLocales.filter(c => c.ID_CURSO !== id);
                    if (cursoSeleccionado?.ID_CURSO === id) cursoSeleccionado = null;
                    mainContent.innerHTML = renderizarInterfazGlobal();
                } catch (err) {
                    alert("Error al eliminar: " + err.message);
                } finally { Loader.hide(); }
            }
        }

        if (e.target.id === "btn-cancelar-edicion") {
            cursoSeleccionado = null;
            mainContent.innerHTML = renderizarInterfazGlobal();
        }

        if (e.target.id === "btn-agregar-tema-edit") {
            guardarEstadoTemasFormulario();
            temasEditados.push({ TITULO_TEMA: "", HORAS_TEMA: "" });
            actualizarSeccionTemasUI();
        }

        if (e.target.classList.contains("btn-remover-tema") || e.target.parentElement?.classList.contains("btn-remover-tema")) {
            const targetButton = e.target.classList.contains("btn-remover-tema") ? e.target : e.target.parentElement;
            const index = Number(targetButton.getAttribute("data-index"));
            guardarEstadoTemasFormulario();
            if (temasEditados.length > 1) {
                temasEditados.splice(index, 1);
                actualizarSeccionTemasUI();
            } else { alert("El curso debe tener al menos un tema."); }
        }
    });

    // CAPTURA DE SUBMITS DE AMBOS FORMULARIOS
    mainContent.addEventListener("submit", async (e) => {
        e.preventDefault();

        // SUBMIT 1: ACTUALIZACIÓN DE CURSOS
        if (e.target.id === "form-actualizar-curso") {
            guardarEstadoTemasFormulario();
            let idTipoCursoCorrecto = tipoCursoActual === "Profesional" ? 2 : 1;

            const temasProcesados = temasEditados.map(t => {
                const titulo = t.TITULO_TEMA || t.titulo_tema || "";
                const horas = t.HORAS_TEMA !== undefined && t.HORAS_TEMA !== "" ? t.HORAS_TEMA : (t.horas_tema || 0);
                return {
                    titulo_tema: titulo.trim(),
                    horas_duracion: Number(horas) || 0,
                    TITULO_TEMA: titulo.trim(),
                    HORAS_TEMA: Number(horas) || 0
                };
            });

            // 2. EXTRAEMOS DINÁMICAMENTE EL ID DEL INSTRUCTOR DESDE EL CURSO SELECCIONADO
            // Usamos cortocircuito para jalarlo ya sea en mayúsculas o minúsculas del JSON
            const instructorIdReal = cursoSeleccionado.ID_INSTRUCTOR || cursoSeleccionado.id_instructor;

            const jsonUpdate = {
                curso: {
                    id_curso: cursoSeleccionado.ID_CURSO,
                    nombre: document.getElementById("edit-nombre").value.trim(),
                    cupo_maximo: Number(document.getElementById("edit-cupo").value),
                    anio: Number(document.getElementById("edit-anio").value),
                    periodo: Number(document.getElementById("edit-periodo").value),
                    fecha_inicio: document.getElementById("edit-fecha-inicio").value,
                    fecha_termino: document.getElementById("edit-fecha-termino").value,
                    dias_semana: document.getElementById("edit-dias").value.trim(),
                    horario: document.getElementById("edit-horario").value.trim(),
                    id_tipo_curso: idTipoCursoCorrecto,
                    // 3. Reemplazamos el "|| 2" hardcodeado por el ID real recuperado
                    id_instructor: Number(instructorIdReal), 
                    ID_INSTRUCTOR: Number(instructorIdReal)
                },
                temas: temasProcesados
            };

            try {
                Loader.show();
                await cursosService.actualizarCurso(cursoSeleccionado.ID_CURSO, jsonUpdate);
                alert("¡Curso actualizado con éxito!");
                cursoSeleccionado = null;
                mainContent.innerHTML = await adminCursosPage(tipoCursoActual);
            } catch (err) { alert("Error al actualizar: " + err.message); } 
            finally { Loader.hide(); }
        }

        // SUBMIT 2: REGISTRO DE NUEVO INSTRUCTOR
        if (e.target.id === "form-registrar-instructor") {
            const bodyInstructor = {
                numero_empleado: Number(document.getElementById("inst-numero").value),
                nombre: document.getElementById("inst-nombre").value.trim(),
                apellido_paterno: document.getElementById("inst-paterno").value.trim(),
                apellido_materno: document.getElementById("inst-materno").value.trim(),
                correo: document.getElementById("inst-correo").value.trim(),
                password_acceso: document.getElementById("inst-password").value
            };

            console.log("=> Enviando datos para alta de Instructor (POST):", bodyInstructor);

            try {
                Loader.show();
                await instructoresService.registrarInstructor(bodyInstructor);
                alert(`¡Profesor(a) ${bodyInstructor.nombre} registrado con éxito en el sistema!`);
                e.target.reset();
            } catch (err) {
                alert("Error al registrar instructor: " + err.message);
            } finally {
                Loader.hide();
            }
        }
    });
}

function guardarEstadoTemasFormulario() {
    const filas = document.querySelectorAll("#lista-temas-dinamicos .tema-row");
    temasEditados = Array.from(filas).map(fila => ({
        TITULO_TEMA: fila.querySelector(".input-tema-titulo").value.trim(),
        HORAS_TEMA: fila.querySelector(".input-tema-horas").value ? Number(fila.querySelector(".input-tema-horas").value) : ""
    }));
}

function actualizarSeccionTemasUI() {
    const contenedor = document.getElementById("lista-temas-dinamicos");
    if (contenedor) {
        contenedor.innerHTML = temasEditados.map((t, index) => {
            const tituloVal = t.TITULO_TEMA || t.titulo_tema || '';
            const horasVal = t.HORAS_TEMA !== undefined ? t.HORAS_TEMA : (t.horas_tema || '');
            return `
                <div class="tema-row" style="display: flex; gap: 10px; margin-bottom: 12px; align-items: center; width: 100%;">
                    <input type="text" class="input-tema-titulo" placeholder="Título del tema" value="${tituloVal}" style="flex: 5; padding: 10px; border:1px solid #ccc; border-radius:4px;" required>
                    <input type="number" class="input-tema-horas" placeholder="Hrs" value="${horasVal}" style="flex: 1; padding: 10px; text-align: center; border:1px solid #ccc; border-radius:4px;" min="1" required>
                    <button type="button" class="btn-remover-tema" data-index="${index}" style="width: 38px; height: 38px; background: #fee2e2; border: 1px solid #f87171; color: #dc2626; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; padding:0;">&times;</button>
                </div>
            `;
        }).join('');
    }
}