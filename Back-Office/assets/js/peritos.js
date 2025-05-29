document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('peritoForm');
  const listaPeritos = document.getElementById('lista-peritos');

  function gerarID() {
      return '_' + Math.random().toString(36).substr(2, 9);
  }

  function guardarPeritos(peritos) {
      localStorage.setItem('peritos', JSON.stringify(peritos));
  }

  function obterPeritos() {
      return JSON.parse(localStorage.getItem('peritos')) || [];
  }

  function criarCard(perito) {
    const denuncias = JSON.parse(localStorage.getItem('denuncias')) || [];
    const denunciasDoPerito = denuncias.filter(d => 
        d.estado === "analisar" &&
        Array.isArray(d.peritos) && 
        d.peritos.includes(perito.nome)
        );
    const totalDenuncias = denunciasDoPerito.length;
  
    return `
      <div class="col-md-12 mb-4">
        <div class="card shadow-lg d-flex flex-row" style="max-width: 100%; border-radius: 15px;">
          ${perito.imagem ? `<img src="${perito.imagem}" class="card-img-left" alt="${perito.nome}" style="width: 35%; object-fit: cover; border-top-left-radius: 15px; border-bottom-left-radius: 15px;">` : ''}
          <div class="card-body d-flex flex-column justify-content-start">
            <div class="dropdown position-absolute top-0 end-0 mt-2 me-2">
              <button class="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown">
                <i class="fas fa-ellipsis-v"></i>
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item editar-perito" href="#" data-id="${perito.id}">Editar</a></li>
                <li><a class="dropdown-item text-danger remover-perito" href="#" data-id="${perito.id}">Apagar</a></li>
              </ul>
            </div>
  
            <h5 class="card-title mt-2">${perito.nome}</h5>
            <p class="text-muted mb-1">${perito.especialidade}</p>
            <p class="fw-bold mb-1">Valor: ${perito.valor ? `€${perito.valor}` : 'N/D'}</p>
            <p class="mt-2"><strong>Denúncias Associadas:</strong> ${totalDenuncias}</p>
            <p class="card-text">${perito.descricao || ''}</p>
          </div>
        </div>
      </div>
    `;
  }
  

  function atualizarLista() {
      const peritos = obterPeritos();
      listaPeritos.innerHTML = peritos.map(p => criarCard(p)).join('');
      adicionarEventos();
  }

  function adicionarEventos() {
      document.querySelectorAll('.editar-perito').forEach(button => {
          button.addEventListener('click', function() {
              const peritoId = button.getAttribute('data-id');
              editarPerito(peritoId);
          });
      });

      document.querySelectorAll('.remover-perito').forEach(button => {
          button.addEventListener('click', function() {
              const peritoId = button.getAttribute('data-id');
              removerPerito(peritoId);
          });
      });
  }

  function removerPerito(id) {
      let peritos = obterPeritos();
      peritos = peritos.filter(p => p.id !== id);
      guardarPeritos(peritos);
      atualizarLista();
  }

  function editarPerito(id) {
      const peritos = obterPeritos();
      const perito = peritos.find(p => p.id === id);
      if (!perito) return;

      document.getElementById('nomePerito').value = perito.nome;
      document.getElementById('especialidadePerito').value = perito.especialidade;
      document.getElementById('valorPerito').value = perito.valor || '';
      document.getElementById('descricaoPerito').value = perito.descricao || '';
      document.getElementById('peritoId').value = perito.id;

      document.getElementById('peritoModalLabel').innerText = 'Editar Perito';
      const modal = new bootstrap.Modal(document.getElementById('peritoModal'));
      modal.show();
  }

  form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nome = form.nome.value.trim();
      const especialidade = form.especialidade.value.trim();
      const estado = "Ativo";
      const valor = form.valor.value.trim();
      const descricao = form.descricao.value.trim();
      const imagemInput = document.getElementById("imagemPerito").files[0];
      const peritoId = document.getElementById('peritoId').value;
      const peritos = obterPeritos();

      if (!nome || !especialidade) {
          alert('Por favor, preencha todos os campos obrigatórios.');
          return;
      }

      function guardar(imagemFinal) {
          if (peritoId === '') {
              peritos.push({ id: gerarID(), nome, especialidade, estado, valor, descricao, imagem: imagemFinal });
          } else {
              const index = peritos.findIndex(p => p.id === peritoId);
              if (index !== -1) {
                  peritos[index] = { id: peritoId, nome, especialidade, estado, valor, descricao, imagem: imagemFinal };
              }
          }

          guardarPeritos(peritos);
          atualizarLista();

          form.reset();
          document.getElementById('peritoId').value = '';
          document.getElementById('peritoModalLabel').innerText = 'Adicionar Perito';
          const modal = bootstrap.Modal.getInstance(document.getElementById('peritoModal'));
          modal.hide();
      }

      if (imagemInput) {
          const reader = new FileReader();
          reader.onload = function () {
              guardar(reader.result);
          };
          reader.readAsDataURL(imagemInput);
      } else {
          if (peritoId !== '') {
              const peritoExistente = peritos.find(p => p.id === peritoId);
              guardar(peritoExistente ? peritoExistente.imagem : '');
          } else {
              guardar('');
          }
      }
  });

  atualizarLista();
});


