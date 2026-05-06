import { navigate } from "../routes/router.js";

export function administrativoPage() {
    
    // Simulación de catálogos para Administrativos
    const departamentosAdmin = [
        "Recursos Humanos", 
        "Recursos Financieros", 
        "Servicios Escolares", 
        "Mantenimiento y Equipo", 
        "Dirección",
        "Planeación"
    ];

    const cursosAdminDisponibles = [
        { id: 101, nombre: "Gestión Documental Digital", fecha: "10-12 May", horario: "09:00 - 13:00", lugar: "Edificio A - Planta Alta" },
        { id: 102, nombre: "Atención al Usuario y Calidad", fecha: "18-20 May", horario: "11:00 - 15:00", lugar: "Sala de Juntas 1" },
        { id: 103, nombre: "Excel Avanzado para Oficinas", fecha: "25-29 May", horario: "08:00 - 10:00", lugar: "Lab. Cómputo C" }
    ];

    setTimeout(() => {
        const form = document.getElementById("adminForm");

        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                
                const cursoId = document.getElementById("cursoSelectAdmin").value;
                const cursoElegido = cursosAdminDisponibles.find(c => c.id == cursoId);

                // Guardamos los datos para la confirmación
                window.tempAdminData = {
                    nombre: document.getElementById("nombreA").value,
                    correo: document.getElementById("correoA").value,
                    departamento: document.getElementById("deptoSelectAdmin").value,
                    curso: cursoElegido
                };

                document.getElementById("main-content").innerHTML = renderConfirmacionAdmin();
            });
        }
    }, 0);

    function renderConfirmacionAdmin() {
        const data = window.tempAdminData;
        return `
            <div class="admin-container">
                <div class="card summary-card">
                    <h2 style="text-align: center; color: #2c3e50;">Confirmación Administrativa</h2>
                    <p style="text-align: center; font-size: 13px; margin-bottom: 20px;">
                        Comprobante enviado a: <strong>${data.correo}</strong>
                    </p>
                    
                    <div class="summary-item">
                        <strong>Nombre:</strong>
                        <span>${data.nombre}</span>
                    </div>
                    
                    <div class="summary-item">
                        <strong>Área:</strong>
                        <span>${data.departamento}</span>
                    </div>

                    <h4 style="margin: 20px 0 10px 0; color: #34495e;">Curso Inscrito:</h4>
                    <div class="course-item">
                        <span class="info-label">Capacitación:</span>
                        <strong>${data.curso.nombre}</strong>
                        <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 0.9rem;">
                            <span>📅 ${data.curso.fecha}</span>
                            <span>⏰ ${data.curso.horario}</span>
                        </div>
                        <span class="info-label" style="margin-top:5px;">📍 Ubicación: ${data.curso.lugar}</span>
                    </div>

                    <div class="btn-group-grid">
                        <button class="btn-cancel" onclick="location.reload()">
                             Corregir
                        </button>
                        <button class="btn-confirm" onclick="alert('¡Registro administrativo completado! Revise su correo.')">
                             Validar Registro
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="admin-container">
            <div class="card" style="max-width: 500px;">
                <h1>Portal Administrativo</h1>
                <p style="color: #666; margin-bottom: 20px;">Inscripción a cursos de actualización administrativa.</p>
                
                <form id="adminForm">
                    <div class="form-group">
                        <label>Nombre Completo</label>
                        <input type="text" id="nombreA" placeholder="Su nombre completo" required>
                    </div>

                    <div class="form-group">
                        <label>Correo Institucional</label>
                        <input type="email" id="correoA" placeholder="usuario@itq.edu.mx" required>
                    </div>

                    <div class="form-group">
                        <label>Departamento de Adscripción</label>
                        <select id="deptoSelectAdmin" required>
                            <option value="" disabled selected>Seleccione su área...</option>
                            ${departamentosAdmin.map(d => `<option value="${d}">${d}</option>`).join('')}
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Curso Disponible</label>
                        <select id="cursoSelectAdmin" required>
                            <option value="" disabled selected>Seleccione el curso...</option>
                            ${cursosAdminDisponibles.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('')}
                        </select>
                    </div>

                    <button type="submit" style="margin-top: 10px;">Generar Ficha de Inscripción</button>
                </form>
            </div>
        </div>
    `;
}