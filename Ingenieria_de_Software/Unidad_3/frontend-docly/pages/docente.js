import { navigate } from "../routes/router.js";

export function docentePage() {
    
    // Simulación de catálogos que vendrán del Backend
    const plazas = ["TC", "3/4", "1/2", "Asignatura", "Honorarios"];
    const departamentos = ["Sistemas y Computación", "Ciencias Básicas", "Ingeniería Eléctrica", "Ciencias de la Tierra", "Económico-Administrativo"];
    const cursosDisponibles = [
        { id: 1, nombre: "Inteligencia Artificial", fecha: "15-20 Jun", horario: "08:00 - 12:00", lugar: "Lab. Cómputo B" },
        { id: 2, nombre: "Metodologías Ágiles", fecha: "22-27 Jun", horario: "10:00 - 14:00", lugar: "Sala Audiovisual" },
        { id: 3, nombre: "Ciberseguridad", fecha: "01-05 Jul", horario: "16:00 - 20:00", lugar: "Virtual" }
    ];

    setTimeout(() => {
        const form = document.getElementById("docenteForm");

        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                
                const cursoId = document.getElementById("cursoSelect").value;
                const cursoElegido = cursosDisponibles.find(c => c.id == cursoId);

                // Guardamos los datos para la confirmación
                window.tempDocenteData = {
                    nombre: document.getElementById("nombreD").value,
                    correo: document.getElementById("correoD").value,
                    plaza: document.getElementById("plazaSelect").value,
                    departamento: document.getElementById("deptoSelect").value,
                    curso: cursoElegido
                };

                document.getElementById("main-content").innerHTML = renderConfirmacionDocente();
            });
        }
    }, 0);

    function renderConfirmacionDocente() {
        const data = window.tempDocenteData;
        return `
            <div class="docente-container">
                <div class="card summary-card">
                    <h2 style="text-align: center; color: #2c3e50;">Confirmación de Inscripción</h2>
                    <p style="text-align: center; font-size: 13px; margin-bottom: 20px;">
                        Se enviará una copia de esta información a: <strong>${data.correo}</strong>
                    </p>
                    
                    <div class="summary-item">
                        <strong>Docente:</strong>
                        <span>${data.nombre}</span>
                    </div>
                    
                    <div class="summary-item">
                        <strong>Adscripción:</strong>
                        <span>${data.departamento}</span>
                    </div>

                    <h4 style="margin: 20px 0 10px 0; color: #34495e;">Detalles del Curso:</h4>
                    <div class="course-item">
                        <span class="info-label">Curso:</span>
                        <strong>${data.curso.nombre}</strong>
                        <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 0.9rem;">
                            <span>📅 ${data.curso.fecha}</span>
                            <span>⏰ ${data.curso.horario}</span>
                        </div>
                        <span class="info-label" style="margin-top:5px;">📍 Lugar: ${data.curso.lugar}</span>
                    </div>

                    <div class="btn-group-grid">
                        <button class="btn-cancel" onclick="location.reload()">
                             Corregir
                        </button>
                        <button class="btn-confirm" onclick="alert('¡Inscripción exitosa! Correo enviado.')">
                             Validar e Inscribir
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="docente-container">
            <div class="card" style="max-width: 500px;">
                <h1>Portal del Docente</h1>
                <p style="color: #666; margin-bottom: 20px;">Complete su perfil para inscribirse a cursos.</p>
                
                <form id="docenteForm">
                    <div class="form-group">
                        <label>Nombre Completo</label>
                        <input type="text" id="nombreD" placeholder="Nombre completo" required>
                    </div>

                    <div class="form-group">
                        <label>Correo Electrónico</label>
                        <input type="email" id="correoD" placeholder="ejemplo@itq.edu.mx" required>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div class="form-group">
                            <label>Tipo de Plaza</label>
                            <select id="plazaSelect" required>
                                <option value="" disabled selected>Seleccione...</option>
                                ${plazas.map(p => `<option value="${p}">${p}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Área de Adscripción</label>
                            <select id="deptoSelect" required>
                                <option value="" disabled selected>Seleccione...</option>
                                ${departamentos.map(d => `<option value="${d}">${d}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Seleccionar Curso</label>
                        <select id="cursoSelect" required>
                            <option value="" disabled selected>Cursos disponibles...</option>
                            ${cursosDisponibles.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('')}
                        </select>
                    </div>

                    <button type="submit" style="margin-top: 10px;">Ver Resumen de Inscripción</button>
                </form>
            </div>
        </div>
    `;
}