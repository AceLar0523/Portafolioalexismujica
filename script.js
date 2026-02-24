// Función para abrir el modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "flex"; // Usamos flex para centrar
    document.body.style.overflow = "hidden"; // Evita que se haga scroll detrás
}

// Función para cerrar el modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Reactiva el scroll
}

// Cerrar el modal si se hace clic fuera del contenido
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
        document.body.style.overflow = "auto";
    }
}