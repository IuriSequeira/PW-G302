  function renderizarPedidos() {
    const pedidos = JSON.parse(localStorage.getItem('pedidosAjuda')) || [];
    const container = document.createElement('div');

    if (pedidos.length === 0) {
      container.innerHTML = '<p>Não há pedidos de ajuda registados.</p>';
    } else {
      pedidos.forEach((pedido, index) => {
        const card = document.createElement('div');
        card.className = 'card mb-3';
        card.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${pedido.assunto}</h5>
            <h6 class="card-subtitle mb-2 text-muted">De: ${pedido.nome} | ${pedido.email}</h6>
            <p class="card-text">${pedido.mensagem}</p>
            <p class="card-text"><small class="text-muted">Recebido a ${pedido.data}</small></p>
          </div>
        `;
        container.appendChild(card);
      });
    }

    document.querySelector('.container-xl').appendChild(container);
  }

  window.addEventListener('DOMContentLoaded', renderizarPedidos);
