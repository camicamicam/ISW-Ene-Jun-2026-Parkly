// routes/router.js
import { homePage } from '../pages/home.js';
import { loginPage } from '../pages/login.js';

const Placeholder = (title) => () => `<h1>${title}</h1><p>Próximamente...</p>`;

const routes = {
    '/': homePage,
    '/index.html': homePage,
    '/login': loginPage,
    '/perfil-docente': Placeholder("Perfil Docente"),
    '/perfil-administrativo': Placeholder("Perfil Administrativo"),
    '/instructor': Placeholder("Panel de Instructor"),
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