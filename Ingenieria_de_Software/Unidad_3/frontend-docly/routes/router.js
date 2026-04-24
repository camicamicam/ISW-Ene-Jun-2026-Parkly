// routes/router.js
import { homePage } from '../pages/home.js';
import { loginPage } from '../pages/login.js';

// Si aún no tienes estos archivos, puedes crear funciones temporales aquí:
const Placeholder = (title) => () => `<h1>${title}</h1><p>Próximamente...</p>`;

const routes = {
    '/': homePage,
    '/login': loginPage,
    '/perfil-docente': Placeholder("Perfil Docente"),
    '/perfil-administrativo': Placeholder("Perfil Administrativo"),
    '/instructor': Placeholder("Panel de Instructor"),
    '/constancias': Placeholder("Constancias de Cursos")
};

export const navigate = (url) => {
    // Manejar parámetros de búsqueda (?tipo=...)
    const cleanPath = url.split('?')[0];
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