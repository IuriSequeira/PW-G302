
document.addEventListener("DOMContentLoaded", () => {
    const tiposMateriais = {
      carro: { nome: "Carro", quantidade: 0, preco: 100 },
      luvas: { nome: "Luvas", quantidade: 0, preco: 5 },
      mascara: { nome: "Máscara", quantidade: 0, preco: 3 },
      liquidos: { nome: "Líquidos", quantidade: 0, preco: 15 },
      oculos: { nome: "Óculos", quantidade: 0, preco: 25 },
      botas: { nome: "Botas", quantidade: 0, preco: 40 },
      batas: { nome: "Batas", quantidade: 0, preco: 30 },
      capacete: { nome: "Capacete", quantidade: 0, preco: 50 },
    };
  
    const listaContainer = document.getElementById("lista-peritos");
    const form = document.getElementById("peritoForm");
    const select = document.getElementById("estadoPerito");
  
    function renderizarMateriais() {
      listaContainer.innerHTML = "";
      Object.entries(tiposMateriais).forEach(([key, material]) => {
        const card = document.createElement("div");
        card.className = "col-6 col-md-4 col-xl-3";
        card.innerHTML = `
          <div class="app-card app-card-stat shadow-sm h-100 material-card">
            <div class="app-card-body p-3 p-lg-4">
              <h4 class="stats-type mb-1">${material.nome}</h4>
              <div class="stats-figure">${material.quantidade} unidades</div>
              <div class="stats-meta">Preço unitário: €${material.preco}</div>
            </div>
          </div>`;
        listaContainer.appendChild(card);
      });
    }
  
    function carregarDoLocalStorage() {
      const armazenado = JSON.parse(localStorage.getItem("materiaisPorTipo")) || {};
      for (let tipo in armazenado) {
        if (tiposMateriais[tipo]) {
          tiposMateriais[tipo].quantidade = armazenado[tipo].quantidade;
        }
      }
    }
  
    function guardarNoLocalStorage() {
      localStorage.setItem("materiaisPorTipo", JSON.stringify(tiposMateriais));
    }
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const tipoSelecionado = select.value.toLowerCase();
      if (tiposMateriais[tipoSelecionado]) {
        
      const quantidadeInput = document.getElementById("quantidadeMaterial");
      const quantidade = parseInt(quantidadeInput.value, 10) || 1;
      tiposMateriais[tipoSelecionado].quantidade += quantidade;
      
        guardarNoLocalStorage();
        renderizarMateriais();
        form.reset();
        bootstrap.Modal.getInstance(document.getElementById("peritoModal")).hide();
      }
    });
  
    carregarDoLocalStorage();
    renderizarMateriais();
  });