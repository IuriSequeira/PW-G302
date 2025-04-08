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
        return `
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card border-0 shadow-sm rounded-4">
              <div class="card-body position-relative">
                <div class="dropdown position-absolute top-0 end-0 mt-2 me-2">
                  <button class="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item editar-perito" href="#" data-id="${perito.id}">Editar</a></li>
                    <li><a class="dropdown-item text-danger remover-perito" href="#" data-id="${perito.id}">Apagar</a></li>
                  </ul>
                </div>
                <h5 class="card-title">${perito.nome}</h5>
                <p class="card-text">${perito.especialidade}</p>
                <span class="badge bg-success">${perito.estado}</span>
              </div>
            </div>
          </div>
        `;
    }

    function atualizarLista() {
        const peritos = obterPeritos();
        listaPeritos.innerHTML = peritos.map(p => criarCard(p)).join('');
        adicionarEventos(); // Chama a função que adiciona eventos aos botões de editar e remover
    }

    function adicionarEventos() {
        // Adiciona eventos aos botões Editar e Remover dinamicamente
        const editarButtons = document.querySelectorAll('.editar-perito');
        const removerButtons = document.querySelectorAll('.remover-perito');

        editarButtons.forEach(button => {
            button.addEventListener('click', function() {
                const peritoId = button.getAttribute('data-id');
                editarPerito(peritoId);
            });
        });

        removerButtons.forEach(button => {
            button.addEventListener('click', function() {
                const peritoId = button.getAttribute('data-id');
                removerPerito(peritoId);
            });
        });
    }

    function removerPerito(id) {
        let peritos = obterPeritos();
        peritos = peritos.filter(p => p.id !== id);  // Remove perito com ID correspondente
        guardarPeritos(peritos);  // Atualiza os dados no localStorage
        atualizarLista();  // Atualiza a lista de peritos na UI
    }

    function editarPerito(id) {
        const peritos = obterPeritos();
        const perito = peritos.find(p => p.id === id);
        if (!perito) return;

        document.getElementById('nomePerito').value = perito.nome;
        document.getElementById('especialidadePerito').value = perito.especialidade;
        document.getElementById('estadoPerito').value = perito.estado;
        document.getElementById('peritoId').value = perito.id;

        document.getElementById('peritoModalLabel').innerText = 'Editar Perito';
        const modal = bootstrap.Modal.getInstance(document.getElementById('peritoModal'));
        modal.show();
    }

    // Inserir peritos iniciais se não houver nenhum
    if (obterPeritos().length === 0) {
        const peritosIniciais = [
            { id: gerarID(), nome: "Dr. Jorge Soares", especialidade: "Técnico de Laboratório", estado: "Ativo" },
            { id: gerarID(), nome: "Dr. Pedro Almeida", especialidade: "Engenheiro Ambiental", estado: "Ativo" },
            { id: gerarID(), nome: "Dr. Carlos Macedo", especialidade: "Auditor de Qualidade", estado: "Ativo" },
            { id: gerarID(), nome: "Dra. Diana Santos", especialidade: "Enfermeira Auditora", estado: "Ativo" }
        ];
        guardarPeritos(peritosIniciais);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const nome = form.nome.value.trim();
        const especialidade = form.especialidade.value.trim();
        const estado = form.estado.value;

        if (!nome || !especialidade || !estado) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const peritoId = document.getElementById('peritoId').value;
        const peritos = obterPeritos();

        if (peritoId === '') {
            // Adicionar novo perito
            peritos.push({ id: gerarID(), nome, especialidade, estado });
        } else {
            // Editar perito existente
            const index = peritos.findIndex(p => p.id === peritoId);
            if (index !== -1) {
                peritos[index] = { id: peritoId, nome, especialidade, estado };
            }
        }

        guardarPeritos(peritos);
        atualizarLista();

        form.reset();
        document.getElementById('peritoId').value = '';
        document.getElementById('peritoModalLabel').innerText = 'Adicionar Perito';

        // Fechar o modal após guardar
        const modal = bootstrap.Modal.getInstance(document.getElementById('peritoModal'));
        modal.hide();
    });

    atualizarLista();
});
