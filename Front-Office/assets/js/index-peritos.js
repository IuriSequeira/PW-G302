document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("doctorSlideshow");
    if (!container) return;

    const peritos = JSON.parse(localStorage.getItem("peritos")) || [];

    const html = peritos.map(perito => `
      <div class="item">
        <div class="card-doctor">
          <div class="header">
            <img src="${perito.imagem}" alt="${perito.nome}">
            <div class="meta">
              <a href="#"><span class="mai-call"></span></a>
              <a href="#"><span class="mai-logo-whatsapp"></span></a>
            </div>
          </div>
          <div class="body">
            <p class="text-xl mb-0">${perito.nome}</p>
            <span class="text-sm text-grey">${perito.especialidade}</span>
          </div>
        </div>
      </div>
    `).join("");

    container.innerHTML = html;

    // Reativar o Owl Carousel após inserir os elementos
    $("#doctorSlideshow").owlCarousel({
    items: 4,
    margin: 30,
    dots: true, // mantém os pontos se quiseres
    nav: true, // ATIVAR SETAS
    navText: [
        '<span class="mai-arrow-back-circle-outline"></span>',
        '<span class="mai-arrow-forward-circle-outline"></span>'
    ],
    responsive: {
        0: { items: 1 },
        768: { items: 2 },
        992: { items: 3 }
    }
    });
});