// Cargar turnos al iniciar
// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
  cargarTurnos();

  const btnFiltrar = document.getElementById('btn-filtrar');
  if (btnFiltrar) btnFiltrar.addEventListener('click', aplicarFiltros);

  const btnLimpiar = document.getElementById('btn-limpiar');
  if (btnLimpiar) btnLimpiar.addEventListener('click', () => {
    // limpiar inputs
    document.querySelector('[name="fecha_desde"]').value = '';
    document.querySelector('[name="fecha_hasta"]').value = '';
    document.querySelector('[name="destino"]').value = '';
    document.querySelector('[name="chofer"]').value = '';
    cargarTurnos();
  });

});

// --- Cargar todos los turnos ---
function cargarTurnos() {
  fetch('../backend/obtener_turnos.php')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      renderizarTurnos(data);
    })
    .catch(error => {
      console.error('Error al cargar turnos:', error);
      const cuerpo = document.getElementById('cuerpo-turnos');
      cuerpo.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-red-600">
        Error al obtener turnos: ${error.message}
      </td></tr>`;
    });
}

// --- Aplicar filtros ---
function aplicarFiltros() {
  const fechaDesde = document.querySelector('[name="fecha_desde"]')?.value;
  const fechaHasta = document.querySelector('[name="fecha_hasta"]')?.value;
  const destino = document.querySelector('[name="destino"]')?.value;
  const chofer = document.querySelector('[name="chofer"]')?.value;
  const estado = document.querySelector('[name="estado"]')?.value;

  const params = new URLSearchParams();
  if (fechaDesde) params.append('fecha_desde', fechaDesde);
  if (fechaHasta) params.append('fecha_hasta', fechaHasta);
  if (destino) params.append('destino', destino);
  if (chofer) params.append('chofer', chofer);
  if (estado) params.append('estado', estado);  // ✅ este es el fix

  fetch(`../backend/obtener_turnos.php?${params.toString()}`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      renderizarTurnos(data);
    })
    .catch(err => {
      console.error('Error al aplicar filtros:', err);
      const cuerpo = document.getElementById('cuerpo-turnos');
      cuerpo.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-red-600">
        Error al aplicar filtros: ${err.message}
      </td></tr>`;
    });
}

// --- Renderizado compartido ---
function renderizarTurnos(data) {
  const cuerpo = document.getElementById('cuerpo-turnos');
  cuerpo.innerHTML = '';

  if (!Array.isArray(data) || data.length === 0) {
    cuerpo.innerHTML = '<tr><td colspan="9" class="text-center py-4 text-gray-500">No se encontraron turnos.</td></tr>';
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






