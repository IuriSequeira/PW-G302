//barra de pesquisa com highlight
document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.querySelector(".search-form");
  const searchInput = searchForm?.querySelector("input");
  const contentElement = document.querySelector(".post-content");

  // Guardar texto original só se estivermos na página com artigo único
  const originalText = contentElement?.textContent || "";

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const keyword = searchInput.value.trim().toLowerCase();

      if (keyword) {
        console.log("Pesquisar por:", keyword);

        if (contentElement) {
          contentElement.innerHTML = highlightWord(originalText, keyword);
        } else {
          highlightPostsInList(keyword);
        }

      } else {
        console.log("Campo de pesquisa vazio");
        if (contentElement) contentElement.innerHTML = originalText;
      }
    });
  }

  // Função para destacar palavras
  function highlightWord(text, word) {
    const regex = new RegExp(`(${word})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  // Função para destacar nas ocorrências (ex: títulos)
  function highlightPostsInList(word) {
    const titles = document.querySelectorAll(".post-title a");
    titles.forEach(link => {
      const original = link.textContent;
      const highlighted = highlightWord(original, word);
      link.innerHTML = highlighted;
    });
  }

  // CLiques tags
  const tags = document.querySelectorAll(".tag-cloud-link");
  tags.forEach(tag => {
    tag.addEventListener("click", function (event) {
      event.preventDefault();
      const tagName = tag.textContent.trim();
      console.log("Filtrar por tag:", tagName);
      highlightPostsInList(tagName.toLowerCase());
    });
  });
});

//cliques categoria
document.addEventListener("DOMContentLoaded", function () {
  const categoryLinks = document.querySelectorAll(".categories a");

  categoryLinks.forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const categoriaCompleta = link.textContent.trim();
      const nomeCategoria = categoriaCompleta.replace(/\s+\d+$/, "");

      console.log("Categoria clicada:", nomeCategoria);
    });
  });
});



