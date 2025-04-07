document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('peritoForm');
    const listaPeritos = document.getElementById('lista-peritos');
  
    function guardarPeritos(peritos) {
      localStorage.setItem('peritos', JSON.stringify(peritos));
    }
  
    function obterPeritos() {
      return JSON.parse(localStorage.getItem('peritos')) || [];
    }
  
    function criarCard(perito, index) {
      return `
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body">
              <h5 class="card-title">${perito.nome}</h5>
              <p class="card-text">${perito.especialidade}</p>
              <span class="badge bg-success">${perito.estado}</span>
              <button class="btn btn-sm btn-danger mt-3" onclick="removerPerito(${index})">Remover</button>
            </div>
          </div>
        </div>
      `;
    }
  
    function atualizarLista() {
      const peritos = obterPeritos();
      listaPeritos.innerHTML = peritos.map((p, i) => criarCard(p, i)).join('');
    }
  
    // Inserir peritos iniciais se não houver nenhum
    if (obterPeritos().length === 0) {
      const peritosIniciais = [
        { nome: "Dr. Jorge Soares", especialidade: "Técnico de Laboratório", estado: "Ativo" },
        { nome: "Dr. Pedro Almeida", especialidade: "Engenheiro Ambiental", estado: "Ativo" },
        { nome: "Dr. Carlos Macedo", especialidade: "Auditor de Qualidade", estado: "Ativo" },
        { nome: "Dra. Diana Santos", especialidade: "Enfermeira Auditora", estado: "Ativa" }
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
  
      const peritos = obterPeritos();
      peritos.push({ nome, especialidade, estado });
      guardarPeritos(peritos);
      atualizarLista();
      form.reset();
  
      // Fechar o modal após guardar
      const modal = bootstrap.Modal.getInstance(document.getElementById('peritoModal'));
      modal.hide();
    });
  
    atualizarLista();
});
  
// Função global para remover peritos
function removerPerito(index) {
  const peritos = JSON.parse(localStorage.getItem('peritos')) || [];
  peritos.splice(index, 1);
  localStorage.setItem('peritos', JSON.stringify(peritos));
  document.getElementById('lista-peritos').innerHTML = '';
  peritos.forEach((p, i) => {
    document.getElementById('lista-peritos').innerHTML += `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body">
            <h5 class="card-title">${p.nome}</h5>
            <p class="card-text">${p.especialidade}</p>
            <span class="badge bg-success">${p.estado}</span>
            <button class="btn btn-sm btn-danger mt-3" onclick="removerPerito(${i})">Remover</button>
          </div>
        </div>
      </div>
    `;
  });
}