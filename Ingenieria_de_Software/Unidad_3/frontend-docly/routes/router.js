// routes/router.js
import { homePage } from '../pages/home.js';
import { loginPage } from '../pages/login.js';
import { instructorPage } from '../pages/instructor.js';
import { docentePage } from '../pages/docente.js';
import { administrativoPage } from '../pages/administrativo.js';
import { adminCursosPage } from '../pages/adminCursos.js';
import {constanciasPage} from '../pages/constancias.js';

const Placeholder = (title) => () => `<h1>${title}</h1><p>Próximamente...</p>`;

const routes = {
    '/': homePage,
    '/index.html': homePage,
    '/login': loginPage,
    '/docente': docentePage,
    '/administrativo': administrativoPage,
    '/instructor': instructorPage,
    '/admin-cursos': adminCursosPage,
    '/constancias': constanciasPage
};

const titles = {
    '/': 'Docly - Inicio',
    '/index.html': 'Docly - Inicio',
    '/login': 'Docly - Iniciar Sesión',
    '/docente': 'Docly - Panel Docente',
    '/administrativo': 'Docly - Panel Administrativo',
    '/instructor': 'Docly - Panel Instructor',
    '/admin-cursos': 'Docly - Administrador',
    '/constancias': 'Docly - Mis Constancias'
};

export const navigate = (url) => {
    window.history.pushState(null, null, url);
    handleRoute();
};

export const handleRoute = async () => {
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlParams.entries());
    const pageFunction = routes[path] || homePage; 

    //Cambiar el titulo en login
    if (path === '/login') {
        const tipo = urlParams.get('tipo');
        if (tipo === 'constancia') {
            document.title = 'Docly - Acceso a Constancias';
        } else if (tipo === 'admin') {
            document.title = 'Docly - Acceso Administrador';
        } else {
            document.title = 'Docly - Acceso Instructor';
        }
    } else { //Cambiar en otras pestañas
        document.title = titles[path] || 'Docly';
    }

    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = await pageFunction();
    }
};

window.addEventListener("popstate", handleRoute);
// Borra cualquier declaración de loginPage que tengas aquí abajo