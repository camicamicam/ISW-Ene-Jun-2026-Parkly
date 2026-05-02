// components/navbar.js
import { navigate } from "../routes/router.js";

export function renderNavbar() {
    const container = document.getElementById("navbar-container");
    if (!container) return;

    container.innerHTML = `
        <nav class="navbar">
            <div class="logo" id="logo-btn">Docly</div>
            
            <div class="menu-toggle" id="menu-toggle">☰</div>

            <ul class="menu" id="main-menu">
                <li class="dropdown">
                    <a href="#" class="dropdown-link">Cursos Profesional</a>
                    <ul class="submenu">
                        <li><a href="#" data-path="/docente">Docente</a></li>
                        <li><a href="#" data-path="/administrativo">Administrativo</a></li>
                        <li><a href="#" data-path="/login?tipo=instructor">Instructor</a></li>
                    </ul>
                </li>

                <li class="dropdown">
                    <a href="#" class="dropdown-link">Cursos Docente</a>
                    <ul class="submenu">
                        <li><a href="#" data-path="/perfil-docente">Docente</a></li>
                        <li><a href="#" data-path="/perfil-administrativo">Administrativo</a></li>
                        <li><a href="#" data-path="/login?tipo=instructor">Instructor</a></li>
                    </ul>
                </li>

                <li>
                    <a href="#" data-path="/login?tipo=constancia">Constancias</a>
                </li>
            </ul>
        </nav>
    `;

    setupNavbarEvents();
}

function setupNavbarEvents() {
    // 1. Logo al Home
    document.getElementById("logo-btn").onclick = () => navigate("/");

    // 2. Toggle Menú Móvil
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("main-menu");
    toggle.onclick = () => menu.classList.toggle("active");

    // 3. Manejo de Clics en Links (SPA)
    document.querySelectorAll(".menu a[data-path]").forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            const path = link.getAttribute("data-path");
            navigate(path);
            menu.classList.remove("active"); // Cerrar menú en móvil tras clic
        };
    });

    // 4. Dropdowns en Móvil
    document.querySelectorAll(".dropdown-link").forEach(link => {
        link.onclick = (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                link.parentElement.classList.toggle("active");
            }
        };
    });
}