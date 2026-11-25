const ESTILOS_TIPO = {
    success: {
        accent: "#27ae60",
        badgeBg: "#d4edda",
        badgeColor: "#155724",
        icon: "fa-circle-check",
        tituloDefault: "¡Listo!"
    },
    error: {
        accent: "#e74c3c",
        badgeBg: "#f8d7da",
        badgeColor: "#721c24",
        icon: "fa-circle-xmark",
        tituloDefault: "Atención"
    },
    info: {
        accent: "#2c3e50",
        badgeBg: "#e9ecef",
        badgeColor: "#2c3e50",
        icon: "fa-circle-info",
        tituloDefault: "Aviso"
    },
    warning: {
        accent: "#e67e22",
        badgeBg: "#fff3cd",
        badgeColor: "#856404",
        icon: "fa-triangle-exclamation",
        tituloDefault: "Confirmar acción"
    }
};

function asegurarContenedorPopup() {
    let overlay = document.getElementById("docly-popup-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "docly-popup-overlay";
        overlay.style.cssText = `
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.55);
            z-index: 9999;
            justify-content: center;
            align-items: center;
            padding: 16px;
            box-sizing: border-box;
            font-family: 'Segoe UI', Roboto, sans-serif;
        `;
        document.body.appendChild(overlay);
    }
    return overlay;
}

function cerrarPopup(overlay) {
    overlay.style.display = "none";
    overlay.innerHTML = "";
}

export const Popup = {
    /**
     * Muestra un pop-up informativo, de éxito o de error (reemplazo de alert).
     * @param {string} mensaje - Texto o HTML sencillo a mostrar.
     * @param {"success"|"error"|"info"|"warning"} tipo
     * @param {string} [titulo]
     * @returns {Promise<void>}
     */
    notify(mensaje, tipo = "info", titulo = null) {
        return new Promise((resolve) => {
            const overlay = asegurarContenedorPopup();
            const cfg = ESTILOS_TIPO[tipo] || ESTILOS_TIPO.info;
            const textoSeguro = String(mensaje ?? "").replace(/\n/g, "<br>");

            overlay.innerHTML = `
                <div role="dialog" aria-modal="true" style="
                    background: #ffffff;
                    width: 100%;
                    max-width: 420px;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
                    border-top: 6px solid ${cfg.accent};
                    padding: 24px;
                    box-sizing: border-box;
                    text-align: center;
                ">
                    <div style="
                        width: 48px;
                        height: 48px;
                        margin: 0 auto 14px auto;
                        border-radius: 50%;
                        background: ${cfg.badgeBg};
                        color: ${cfg.badgeColor};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 22px;
                    ">
                        <i class="fa-solid ${cfg.icon}"></i>
                    </div>
                    <h3 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 19px;">
                        ${titulo || cfg.tituloDefault}
                    </h3>
                    <p style="margin: 0 0 22px 0; color: #555; font-size: 14px; line-height: 1.5; word-break: break-word;">
                        ${textoSeguro}
                    </p>
                    <button type="button" id="docly-popup-aceptar" style="
                        width: 100%;
                        padding: 10px 18px;
                        background: ${cfg.accent};
                        color: #ffffff;
                        border: none;
                        border-radius: 6px;
                        font-weight: 600;
                        font-size: 14px;
                        cursor: pointer;
                    ">Aceptar</button>
                </div>
            `;

            overlay.style.display = "flex";

            const btnAceptar = document.getElementById("docly-popup-aceptar");
            const finalizar = () => {
                cerrarPopup(overlay);
                resolve();
            };

            btnAceptar.addEventListener("click", finalizar);
            btnAceptar.focus();
        });
    },

    /**
     * Muestra un pop-up de confirmación con Cancelar / Confirmar (reemplazo de confirm).
     * @param {string} mensaje
     * @param {{ titulo?: string, textoConfirmar?: string, textoCancelar?: string, peligro?: boolean }} [opciones]
     * @returns {Promise<boolean>}
     */
    confirm(mensaje, opciones = {}) {
        return new Promise((resolve) => {
            const overlay = asegurarContenedorPopup();
            const {
                titulo = "Confirmar acción",
                textoConfirmar = "Confirmar",
                textoCancelar = "Cancelar",
                peligro = false
            } = opciones;

            const colorConfirmar = peligro ? "#e74c3c" : "#2c3e50";
            const textoSeguro = String(mensaje ?? "").replace(/\n/g, "<br>");

            overlay.innerHTML = `
                <div role="dialog" aria-modal="true" style="
                    background: #ffffff;
                    width: 100%;
                    max-width: 420px;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
                    border-top: 6px solid ${colorConfirmar};
                    padding: 24px;
                    box-sizing: border-box;
                    text-align: center;
                ">
                    <div style="
                        width: 48px;
                        height: 48px;
                        margin: 0 auto 14px auto;
                        border-radius: 50%;
                        background: ${peligro ? "#f8d7da" : "#fff3cd"};
                        color: ${peligro ? "#721c24" : "#856404"};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 22px;
                    ">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <h3 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 19px;">
                        ${titulo}
                    </h3>
                    <p style="margin: 0 0 22px 0; color: #555; font-size: 14px; line-height: 1.5;">
                        ${textoSeguro}
                    </p>
                    <div style="display: flex; gap: 12px;">
                        <button type="button" id="docly-popup-cancelar" style="
                            flex: 1;
                            padding: 10px 14px;
                            background: #95a5a6;
                            color: #ffffff;
                            border: none;
                            border-radius: 6px;
                            font-weight: 600;
                            font-size: 14px;
                            cursor: pointer;
                        ">${textoCancelar}</button>
                        <button type="button" id="docly-popup-confirmar" style="
                            flex: 1;
                            padding: 10px 14px;
                            background: ${colorConfirmar};
                            color: #ffffff;
                            border: none;
                            border-radius: 6px;
                            font-weight: 600;
                            font-size: 14px;
                            cursor: pointer;
                        ">${textoConfirmar}</button>
                    </div>
                </div>
            `;

            overlay.style.display = "flex";

            const finalizar = (resultado) => {
                cerrarPopup(overlay);
                resolve(resultado);
            };

            document.getElementById("docly-popup-cancelar").addEventListener("click", () => finalizar(false));
            document.getElementById("docly-popup-confirmar").addEventListener("click", () => finalizar(true));
        });
    }
};