function renderizarPedidos() {
  const pedidos = JSON.parse(localStorage.getItem('pedidosAjuda')) || [];
  const container = document.createElement('div');

  if (pedidos.length === 0) {
    container.innerHTML = '<p>Não há pedidos de ajuda registados.</p>';
  } else {
    pedidos.forEach((pedido, index) => {
      const card = document.createElement('div');
      card.className = 'card mb-3';

      const estadoBadge = pedido.estado === "Revisto"
        ? '<span class="badge bg-success">Revisto</span>'
        : '<span class="badge bg-warning text-dark">A Rever</span>';

      card.innerHTML = `
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <h5 class="card-title">${pedido.assunto}</h5>
            ${estadoBadge}
          </div>
          <h6 class="card-subtitle mb-2 text-muted">De: ${pedido.nome} | ${pedido.email}</h6>
          <p class="card-text">${pedido.mensagem}</p>
          <p class="card-text"><small class="text-muted">Recebido a ${pedido.data}</small></p>
          <button class="btn btn-success btn-sm me-2 marcar-revisto" data-index="${index}">Marcar como Revisto</button>
          <button class="btn btn-danger btn-sm eliminar" data-index="${index}">Eliminar</button>
        </div>
      `;

      container.appendChild(card);
    });
  }

  const zonaConteudo = document.querySelector('.container-xl');
  zonaConteudo.innerHTML = '<h1 class="app-page-title">Centro de ajuda</h1>'; // limpar e manter o título
  zonaConteudo.appendChild(container);

  // Eventos dos botões
  document.querySelectorAll('.marcar-revisto').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = this.getAttribute('data-index');
      pedidos[idx].estado = "Revisto";
      localStorage.setItem('pedidosAjuda', JSON.stringify(pedidos));
      renderizarPedidos(); // recarrega
    });
  });

  document.querySelectorAll('.eliminar').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = this.getAttribute('data-index');
      if (confirm("Tem a certeza que deseja eliminar este pedido?")) {
        pedidos.splice(idx, 1);
        localStorage.setItem('pedidosAjuda', JSON.stringify(pedidos));
        renderizarPedidos();
      }
    });
  });
}

window.addEventListener('DOMContentLoaded', renderizarPedidos);