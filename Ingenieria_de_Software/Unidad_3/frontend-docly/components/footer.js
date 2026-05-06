export function renderFooter() {
    const container = document.getElementById("footer-container");
    if (!container) return;

    container.innerHTML = `
        <footer class="footer">
            <div class="footer-content">
                <div class="footer-info">
                    <p>&copy; 2026 Sistema Docly. Todos los derechos reservados.</p>
                </div>
                <div class="footer-links">
                    <span>Querétaro, México</span>
                    <span class="separator">|</span>
                    <a href="mailto:dda@queretaro.tecnm.mx">Contacto DDA</a>
                </div>
            </div>
        </footer>
    `;
}