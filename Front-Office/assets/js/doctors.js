document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("lista-peritos-front");
  if (!container) return;

  const peritos = JSON.parse(localStorage.getItem("peritos")) || [];

  // Geração dinâmica dos cartões de peritos
  const html = peritos.map(perito => {
    return `
      <div class="col-md-12 mb-5">
        <div class="card shadow-lg d-flex flex-row" style="max-width: 100%; border-radius: 15px;">
          <img 
            src="${perito.imagem}" 
            alt="${perito.nome}" 
            class="card-img-left"
            style="width: 35%; object-fit: cover; border-top-left-radius: 15px; border-bottom-left-radius: 15px;"
          >
          <div class="card-body">
            <h5 class="card-title">${perito.nome}</h5>
            <p class="text-muted mb-1">${perito.especialidade}</p>
            <p class="card-text">${perito.descricao}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
});

  
  