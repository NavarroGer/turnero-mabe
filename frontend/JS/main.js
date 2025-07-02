// Cargar turnos al iniciar
document.addEventListener('DOMContentLoaded', () => {
  cargarTurnos();
});

// Cargar turnos desde el backend
function cargarTurnos() {
  fetch('../backend/obtener_turnos.php')  // ✅ este es el correcto para cargar todos

    .then(response => response.json())
    .then(data => {
      
      const cuerpo = document.getElementById('cuerpo-turnos');
      cuerpo.innerHTML = '';

      if (data.length === 0) {
        cuerpo.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-gray-500">No hay turnos registrados.</td></tr>';
        return;
      }

      data.forEach(turno => {
        const fila = document.createElement('tr');

    let claseEstado = '';
      if (turno.estado === 'Planificado') claseEstado = 'estado-planificado';
      if (turno.estado === 'Pikeado') claseEstado = 'estado-pikeado';
      if (turno.estado === 'Cargado') claseEstado = 'estado-cargado';


        fila.innerHTML = `
          <td class="border px-4 py-2">${turno.fecha}</td>
          <td class="border px-4 py-2">${turno.hora}</td>
          <td class="border px-4 py-2">${turno.destino}</td>
          <td class="border px-4 py-2">${turno.transporte_tipo}</td>
          <td class="border px-4 py-2">${turno.empresa_tercero || '-'}</td>
          <td class="border px-4 py-2">${turno.circuito}</td>
          <td class="border px-4 py-2">${turno.chofer}</td>
          <td class="border px-4 py-2 ${claseEstado}">${turno.estado}</td>

          
          <td class="border px-4 py-2">
            <button onclick="editarTurno(${turno.id})" class="text-blue-600 hover:underline">Editar</button>
            <button onclick="eliminarTurno(${turno.id})" class="text-red-600 hover:underline ml-2">Eliminar</button>
          </td>
        `;
        cuerpo.appendChild(fila);
      });
    })
    .catch(error => {
      console.error('Error al cargar turnos:', error);
      alert('Error al obtener turnos');
    });
}


// Guardar nuevo turno y Editar turno
document.getElementById('form-turno').addEventListener('submit', function (e) {
  e.preventDefault();

  const form = this;
  const formData = new FormData(form);
  const modo = form.dataset.modo;
  const id = form.dataset.id;

  let url = '../backend/guardar_turno.php';
  if (modo === 'editar') {
    url = '../backend/actualizar_turno.php';
    formData.append('id', id);
  }

  fetch(url, {
    method: 'POST',
    body: formData
  })
    .then(res => res.text())
    .then(data => {
      alert(data);
      cerrarModal();
      form.reset();
      cargarTurnos();

      // Limpiar modo
      delete form.dataset.modo;
      delete form.dataset.id;
    })
    .catch(err => alert("Error: " + err));
});

function eliminarTurno(id) {
  if (!confirm('¿Seguro que deseas eliminar este turno?')) return;

  const formData = new FormData();
  formData.append('id', id);

  fetch('../backend/eliminar_turno.php', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(data.message);
        cargarTurnos(); // Actualizar la tabla
      } else {
        alert(data.error || 'Error al eliminar turno');
      }
    })
    .catch(err => {
      alert("Error al eliminar turno: " + err);
    });
}


// Abrir y cerrar modal
function abrirModal() {
  document.getElementById('modalTurno').classList.remove('hidden');
}

function cerrarModal() {
  document.getElementById('modalTurno').classList.add('hidden');
}

function editarTurno(id) {
  fetch(`../backend/obtener_turno.php ? id=${id}`)
    .then(res => res.json())
    .then(turno => {
      if (!turno || !turno.id) {
        alert("No se encontró el turno.");
        return;
      }

      // Mostrar el modal
      abrirModal();


      // Marcar que es una edición
      const form = document.getElementById("form-turno");
      form.dataset.modo = "editar";
      form.dataset.id = turno.id;

      // Precargar campos
      form.querySelector('[name="fecha"]').value = turno.fecha;
      form.querySelector('[name="hora"]').value = turno.hora;
      form.querySelector('[name="destino"]').value = turno.destino;
      form.querySelector('[name="transporte_tipo"]').value = turno.transporte_tipo;
      form.querySelector('[name="empresa_tercero"]').value = turno.empresa_tercero || "";
      form.querySelector('[name="circuito"]').value = turno.circuito;
      form.querySelector('[name="chofer"]').value = turno.chofer;
      form.querySelector('[name="estado"]').value = turno.estado;
    })
    .catch(err => {
      console.error("Error al obtener turno:", err);
      alert("Error al cargar turno para edición");
    });
}



