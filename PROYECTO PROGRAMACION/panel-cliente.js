const sesionGuardada = localStorage.getItem('sesionActiva');

if (!sesionGuardada) {
    window.location.href = "login.html";
}
const usuarioLogueado = JSON.parse(sesionGuardada);

document.getElementById('btn-cerrar-sesion-cliente').addEventListener('click', () => {
    localStorage.removeItem('sesionActiva');
    window.location.href = "index.html";
});

const listaOrdenesCliente = document.getElementById('lista-ordenes-cliente');
const todasLasOrdenes = JSON.parse(localStorage.getItem('ordenesReparacion')) || [];

const misOrdenes = todasLasOrdenes.filter(orden => orden.dni === usuarioLogueado.username);

if (misOrdenes.length === 0) {
    listaOrdenesCliente.innerHTML = '<div class="tarjeta-panel"><p>No tenés equipos en el taller actualmente.</p></div>';
} else {
    misOrdenes.forEach(orden => {
        const divOrden = document.createElement('div');
        divOrden.className = 'tarjeta-orden';
        divOrden.style.borderLeft = '5px solid #354eab';
        divOrden.innerHTML = `
            <h4>Equipo: ${orden.equipo}</h4>
            <p><strong>Motivo:</strong> ${orden.problema}</p>
            <p><strong>Fecha de ingreso:</strong> ${orden.fecha}</p>
            <div style="background-color: #ebf0fa; padding: 10px; border-radius: 5px; margin-top: 15px;">
                <p style="margin: 0; color: #354eab; font-weight: bold;">Estado actual: ${orden.estado}</p>
            </div>
        `;
        listaOrdenesCliente.appendChild(divOrden);
    });
}