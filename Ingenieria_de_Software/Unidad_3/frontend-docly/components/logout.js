// components/logoutButton.js
import { navigate } from "../routes/router.js";

export function logoutButton(tipoModulo) {
    const buttonId = `btnLogout-${tipoModulo}`;

    setTimeout(() => {
        const btn = document.getElementById(buttonId);
        if (btn) {
            if (!btn.dataset.initialized) {
                btn.addEventListener("click", () => {
                    localStorage.removeItem(`token_${tipoModulo}`);
                    localStorage.removeItem(`usuario_${tipoModulo}`);
                    localStorage.removeItem("token");
                    localStorage.removeItem("usuario");

                    localStorage.removeItem("token_admin");
                    localStorage.removeItem("usuario_admin");

                    if(tipoModulo == "admin"){
                        navigate(`/login?tipo=instructor`);
                    }else{
                        navigate(`/login?tipo=${tipoModulo}`);
                    }
                });
                btn.dataset.initialized = "true";
            }
        }
    }, 0);

    return `
        <button id="${buttonId}" style="
            background-color: #e74c3c !important; 
            color: white !important; 
            border: none !important; 
            padding: 6px 12px !important; 
            border-radius: 4px !important; 
            cursor: pointer !important; 
            font-weight: 600 !important; 
            font-size: 13px !important;
            width: auto !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 5px !important;
            box-shadow: none !important;
            transition: background 0.2s !important;
        " onmouseover="this.style.background='#c0392b'" onmouseout="this.style.background='#e74c3c'">
            <i class="fa-solid fa-right-from-bracket"></i> Salir
        </button>
    `;
}