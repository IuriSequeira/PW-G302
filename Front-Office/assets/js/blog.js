// logica para uasr barra de pesquisa
document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.querySelector(".search-form");
    const searchInput = searchForm.querySelector("input");
  
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const keyword = searchInput.value.trim();
  
      if (keyword) {
        console.log("Pesquisar por:", keyword);
      } else {
        console.log("Campo de pesquisa vazio");
      }
    });
  });
  // Função para capturar cliques nas tags
document.addEventListener("DOMContentLoaded", function () {
    const tags = document.querySelectorAll(".tag-cloud-link");
  
    tags.forEach(tag => {
      tag.addEventListener("click", function (event) {
        event.preventDefault(); 
        const tagName = tag.textContent.trim();
        console.log("Filtrar por tag:", tagName);
  
        
      });
    });
  });
  