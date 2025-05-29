function formatarData(dataStr) {
  const data = new Date(dataStr);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}`;
}

function verDetalhes(index) {
  const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];
  const d = denuncias[index];

  // Preencher os dados no modal
  document.getElementById("modalNome").textContent = d.nome || "-";
  document.getElementById("modalEmail").textContent = d.email || "-";
  document.getElementById("modalLocalizacao").textContent = d.localizacao || "-";
  document.getElementById("modalCategoria").textContent = d.categoria || "-";
  document.getElementById("modalDescricao").textContent = d.descricao || "-";
  document.getElementById("modalData").textContent = formatarData(d.data) || "-";

  // Guardar índice para uso no botão de PDF
  document.getElementById("btnDownloadPDF").setAttribute("data-index", index);

  // Abrir o modal
  const modal = new bootstrap.Modal(document.getElementById("modalDetalhes"));
  modal.show();
}

function criarCardDenuncia(denuncia, index, keyword = "") {
  function highlight(text) {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  const card = document.createElement("div");
  card.className = "col-md-6 col-lg-4 mb-4";

  card.innerHTML = `
    <div class="card-blog card h-100">
      <div class="header">
        <div class="post-category">
          <a href="#">${highlight(denuncia.categoria || 'Sem categoria')}</a>
        </div>
        <div class="post-thumb">
          <img src="../assets/img/blog/blog_1.jpg" alt="">
        </div>
      </div>
      <div class="body d-flex flex-column justify-content-between">
        <h5 class="post-title">${highlight(denuncia.descricao)}</h5>
        <div class="site-info">
          <div class="avatar mr-2">
            <div class="avatar-img">
              <img src="../assets/img/person/person_1.jpg" alt="">
            </div>
            <span>${highlight(denuncia.nome)}</span>
          </div>
          <span class="mai-time"></span> ${formatarData(denuncia.data)}
        </div>
        <button class="btn btn-outline-primary btn-block mt-2" onclick="verDetalhes(${index})">Ver</button>
      </div>
    </div>
  `;
  return card;
}


function carregarDenunciasFiltradas(filtroCategoria = "", keyword = "") {
  const container = document.getElementById("cards-denuncias-finalizadas");
  container.innerHTML = "";

  const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];

  const filtradas = denuncias.filter(d => {
    const correspondeCategoria = (d.estado === "finalizada" || d.estado === "cancelada") &&
      (filtroCategoria === "" || d.categoria?.toLowerCase() === filtroCategoria.toLowerCase());

    const correspondePesquisa = keyword === "" || (
      d.nome?.toLowerCase().includes(keyword) ||
      d.email?.toLowerCase().includes(keyword) ||
      d.descricao?.toLowerCase().includes(keyword) ||
      d.localizacao?.toLowerCase().includes(keyword)
    );

    return correspondeCategoria && correspondePesquisa;
  });

  filtradas.forEach((denuncia, index) => {
    const card = criarCardDenuncia(denuncia, index, keyword);
    container.appendChild(card);
  });
}


document.addEventListener("DOMContentLoaded", function () {
  carregarDenunciasFiltradas();

  document.querySelectorAll(".tag-cloud-link").forEach(tag => {
    tag.addEventListener("click", e => {
      e.preventDefault();
      const categoria = e.target.textContent.trim();
      carregarDenunciasFiltradas(categoria);
    });
  });

  document.querySelectorAll(".categories a").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const categoriaCompleta = link.textContent.trim();
      const nomeCategoria = categoriaCompleta.replace(/\s+\d+$/, "");
      carregarDenunciasFiltradas(nomeCategoria);
    });
  });
  document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.querySelector(".search-form");
  const searchInput = searchForm?.querySelector("input");

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const keyword = searchInput.value.trim().toLowerCase();
      carregarDenunciasFiltradas("", keyword);
    });
  }
});

  // Botão para gerar PDF
  const btnPDF = document.getElementById("btnDownloadPDF");
  if (btnPDF) {
    btnPDF.addEventListener("click", async function () {
      const idx = this.getAttribute("data-index");
      const relatorios = JSON.parse(localStorage.getItem("relatorios")) || [];
      if (!relatorios[idx]) return alert("Relatório não encontrado.");

      const relatorio = relatorios[idx];
      const d = relatorio.denuncia;

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      let y = 10;
      doc.setFontSize(14);
      doc.text("Relatório de Denúncia", 10, y);
      y += 10;

      const linhas = [
        `Data: ${relatorio.dataGeracao}`,
        `Estado Final: ${relatorio.estadoFinal}`,
        `Nome: ${d.nome}`,
        `Email: ${d.email}`,
        `Localização: ${d.localizacao}`,
        `Descrição: ${d.descricao}`,
        `Explicação Final: ${relatorio.explicacao}`,
        ``
      ];

      linhas.forEach(l => {
        doc.text(l, 10, y);
        y += 8;
      });

      doc.setFont(undefined, 'bold');
      doc.text("Perito(s) Associado(s):", 10, y);
      y += 8;
      doc.setFont(undefined, 'normal');

      let valorPerito = 0;
      if (Array.isArray(d.peritos) && d.peritos.length > 0) {
        d.peritos.forEach(p => {
          const nome = p.nome || "Desconhecido";
          const valor = p.valor || 0;
          valorPerito += valor;
          doc.text(`- ${nome}: €${valor.toFixed(2)}`, 12, y);
          y += 8;
        });
      } else {
        doc.text("Nenhum", 12, y);
        y += 8;
      }

      doc.setFont(undefined, 'bold');
      doc.text("Materiais Associados:", 10, y);
      y += 8;
      doc.setFont(undefined, 'normal');

      let totalMateriais = 0;
      (d.materiais || []).forEach(mat => {
        const preco = mat.valor || 0;
        const subtotal = mat.quantidade * preco;
        totalMateriais += subtotal;
        doc.text(`- ${mat.tipo}: ${mat.quantidade} × €${preco.toFixed(2)} = €${subtotal.toFixed(2)}`, 12, y);
        y += 8;
      });

      const totalFinal = totalMateriais + valorPerito;
      y += 5;

      doc.setFont(undefined, 'bold');
      doc.text("Resumo Financeiro:", 10, y);
      y += 8;
      doc.setFont(undefined, 'normal');
      doc.text(`Total do Perito: €${valorPerito.toFixed(2)}`, 12, y);
      y += 8;
      doc.text(`Total dos Materiais: €${totalMateriais.toFixed(2)}`, 12, y);
      y += 8;
      doc.text(`Valor Total Estimado: €${totalFinal.toFixed(2)}`, 12, y);

      const nomeFicheiro = `${d.localizacao}_${d.categoria || "sem-categoria"}_${relatorio.dataGeracao.replace(/[: ]/g, "_")}.pdf`;
      doc.save(nomeFicheiro);
    });
  }
});
