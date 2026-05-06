export const Loader = {
    show: () => {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.style.display = 'flex';
    },
    hide: () => {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.style.display = 'none';
    }
};