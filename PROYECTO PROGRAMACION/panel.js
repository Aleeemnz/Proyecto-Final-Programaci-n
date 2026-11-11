const sesionGuardada = localStorage.getItem('sesionActiva');

if (!sesionGuardada) {
    window.location.href = "login.html";
} else {
   
    const usuarioLogueado = JSON.parse(sesionGuardada);
    const nombre = usuarioLogueado.username;
    const nombreCapitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1);
    
    document.getElementById('mensaje-bienvenida').innerText = "¡Hola, " + nombreCapitalizado + "!";
};

const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

btnCerrarSesion.addEventListener('click', () => {
    localStorage.removeItem('sesionActiva');
    window.location.href = "index.html";
});

class Orden {
    constructor(cliente, dni, equipo, problema, estado) {
        this.id = Date.now();
        this.cliente = cliente;
        this.dni = dni; // Vincula la orden con el cliente
        this.equipo = equipo;
        this.problema = problema;
        this.estado = estado;
        this.fecha = new Date().toLocaleDateString();
    }
}

let ordenesGuardadas = JSON.parse(localStorage.getItem('ordenesReparacion')) || [];

const formOrden = document.getElementById('form-orden');
const listaOrdenes = document.getElementById('lista-ordenes');


function renderizarOrdenes() {
    listaOrdenes.innerHTML = '';

    if (ordenesGuardadas.length === 0) {
        listaOrdenes.innerHTML = '<p>No hay órdenes activas en este momento.</p>';
        return;
    }

    ordenesGuardadas.forEach(orden => {
        const divOrden = document.createElement('div');
        divOrden.className = 'tarjeta-orden';
        divOrden.innerHTML = `
            <h4>Cliente: ${orden.cliente} (DNI: ${orden.dni})</h4>
            <p><strong>Equipo:</strong> ${orden.equipo}</p>
            <p><strong>Problema:</strong> ${orden.problema}</p>
            <p><strong>Estado:</strong> <span style="color: #354eab; font-weight: bold;">${orden.estado}</span></p>
            <p><small>Ingresado el: ${orden.fecha}</small></p>
            
            <div class="contenedor-botones">
                <button class="btn-accion" onclick="cambiarEstado(${orden.id})">Modificar Estado</button>
                <button class="btn-eliminar" onclick="eliminarOrden(${orden.id})">Marcar como Entregado</button>
            </div>
        `;
        listaOrdenes.appendChild(divOrden);
    });
}

function eliminarOrden(idParaBorrar) {
    ordenesGuardadas = ordenesGuardadas.filter(orden => orden.id !== idParaBorrar);
    localStorage.setItem('ordenesReparacion', JSON.stringify(ordenesGuardadas));
    renderizarOrdenes();
}


formOrden.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const cliente = document.getElementById('cliente').value;
    const dni = document.getElementById('dni').value;
    const equipo = document.getElementById('equipo').value;
    const problema = document.getElementById('problema').value;
    const estado = document.getElementById('estado').value;

    const nuevaOrden = new Orden(cliente, dni, equipo, problema, estado);
    ordenesGuardadas.push(nuevaOrden);
    localStorage.setItem('ordenesReparacion', JSON.stringify(ordenesGuardadas));

    let usuariosLS = JSON.parse(localStorage.getItem('usuarios')) || [];

    const clienteExiste = usuariosLS.find(user => user.username === dni);
    
    if (!clienteExiste) {
        usuariosLS.push({ username: dni, password: dni, rol: 'cliente' });
        localStorage.setItem('usuarios', JSON.stringify(usuariosLS));
        console.log("Cuenta de cliente creada para el DNI: " + dni);
    }

    renderizarOrdenes();
    formOrden.reset();
});

renderizarOrdenes();

let ordenIdEnEdicion = null; 
const modalEstado = document.getElementById('modal-estado');
const selectModal = document.getElementById('nuevo-estado-select');

function cambiarEstado(idParaModificar) {
    ordenIdEnEdicion = idParaModificar; 
    
    const orden = ordenesGuardadas.find(o => o.id === idParaModificar);
    if (orden) {
        selectModal.value = orden.estado;
    }

    modalEstado.classList.remove('modal-oculto');
    modalEstado.classList.add('modal-activo');
}


function cerrarModal() {
    modalEstado.classList.remove('modal-activo');
    modalEstado.classList.add('modal-oculto');
    ordenIdEnEdicion = null;
}

function guardarNuevoEstado() {
    if (ordenIdEnEdicion !== null) {
        const ordenIndex = ordenesGuardadas.findIndex(orden => orden.id === ordenIdEnEdicion);
        
        if (ordenIndex !== -1) {
            ordenesGuardadas[ordenIndex].estado = selectModal.value;
            localStorage.setItem('ordenesReparacion', JSON.stringify(ordenesGuardadas));
            renderizarOrdenes();
        }
    }
    cerrarModal();
}