window.addEventListener('DOMContentLoaded', () => {
    console.log("✅ JavaScript y DOM cargados correctamente.");

    // Mostrar modal con información importante
    const showMessageButton = document.getElementById('showMessage');
    const modal = document.getElementById('modal');
    const closeModalButton = document.getElementById('closeModal');

    showMessageButton.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Agregar canciones al formulario
    const addSongButton = document.getElementById('addSong');
    const songList = document.getElementById('song-list');

    addSongButton.addEventListener('click', () => {
        const songInput = document.createElement('input');
        songInput.type = 'text';
        songInput.name = 'cancion[]';
        songInput.placeholder = '🎵 Ingresa una canción para Karaoke';
        songInput.style = 'margin-top: 10px;';
        songList.appendChild(songInput);
    });

    // Interceptar el evento submit del formulario
    const form = document.getElementById('rsvp-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();  // Evitar envío convencional del formulario

        console.log("📥 Evento Submit capturado por JavaScript.");

        const formData = new FormData(form);

        // Recopilar todas las canciones añadidas al formulario
        const canciones = Array.from(document.querySelectorAll('input[name="cancion[]"]'))
                                .map(input => input.value.trim())
                                .filter(Boolean);

        if (canciones.length > 0) {
            formData.append('cancion', canciones.join(', '));
        }

        const urlencodedData = new URLSearchParams(formData).toString();

        console.log('📤 Datos que se envían a SheetDB:', urlencodedData);

        try {
            const response = await fetch('https://sheetdb.io/api/v1/bmliar8691k86', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: urlencodedData
            });

            if (response.ok) {
                console.log('✅ Datos enviados correctamente a SheetDB.');
                alert('🎉 Si tu respuesta fue sí, ¡Gracias por confirmar tu asistencia!');
                form.reset();
                songList.innerHTML = '';  // Limpiar la lista de canciones
            } else {
                const errorText = await response.text();
                console.error('❌ Error en la respuesta de SheetDB:', errorText);
                alert('❌ Ocurrió un problema al enviar los datos. Revisa la consola para más detalles.');
            }
        } catch (error) {
            console.error('❌ Error al conectar con el servidor:', error);
            alert('❌ No se pudo conectar con SheetDB. Revisa tu conexión a internet o la URL de SheetDB.');
        }
    });
});




