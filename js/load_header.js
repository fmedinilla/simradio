function loadHeader() {
    const $container = document.getElementById('header-container');

    fetch('templates/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.text();
        })
        .then(html => {
            $container.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });
}

// Ejecutar la función al cargar la página
document.addEventListener("DOMContentLoaded", loadHeader);