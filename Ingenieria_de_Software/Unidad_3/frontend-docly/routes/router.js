// routes/router.js
import { homePage } from '../pages/home.js';
import { loginPage } from '../pages/login.js';
import { instructorPage } from '../pages/instructor.js';
//import { docentePage } from '../pages/docente.js';
//import { administrativoPage } from '../pages/administrativo.js';

const Placeholder = (title) => () => `<h1>${title}</h1><p>Próximamente...</p>`;

const routes = {
    '/': homePage,
    '/index.html': homePage,
    '/login': loginPage,
    '/docente': Placeholder("Perfil Docente"),
    '/administrativo': Placeholder("Perfil Administrativo"),
    '/instructor': instructorPage,
    '/constancias': Placeholder("Constancias de Cursos")
};

export const navigate = (url) => {
    window.history.pushState(null, null, url);
    handleRoute();
};

export const handleRoute = async () => {
    const path = window.location.pathname;
    const pageFunction = routes[path] || homePage; 
    
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = await pageFunction();
    }
};

window.addEventListener("popstate", handleRoute);
// Borra cualquier declaración de loginPage que tengas aquí abajo