document.addEventListener("DOMContentLoaded", function () {
    const relatorios = JSON.parse(localStorage.getItem("relatorios")) || [];
    const container = document.querySelector(".row.g-4");
    container.innerHTML = "";
  
    relatorios.forEach((rel, index) => {
        const card = document.createElement("div");
        const d = rel.denuncia;
        const nomeRelatorio = `${d.localizacao} - ${d.categoria || "Sem Categoria"} - ${rel.dataGeracao}`;

      card.className = "col-6 col-md-4 col-xl-3 col-xxl-2";
      card.innerHTML = `
        <div class="app-card app-card-doc shadow-sm h-100">
          <div class="app-card-thumb-holder p-3">
            <span class="icon-holder"><i class="fas fa-file-pdf text-danger"></i></span>
            <span class="badge bg-info">PDF</span>
          </div>
          <div class="app-card-body p-3">
            <h4 class="app-doc-title mb-2">${nomeRelatorio}</h4>
            <div class="app-doc-meta">
             <ul class="list-unstyled mb-2">
                <li><span class="text-muted">Data:</span> ${rel.dataGeracao}</li>
                <li><span class="text-muted">Estado:</span> ${rel.estadoFinal}</li>
              </ul>
            </div>
          </div>
          <div class="app-card-actions p-3">
            <button class="btn-sm app-btn-secondary gerar-pdf" data-index="${index}">Download</button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  
    document.querySelectorAll(".gerar-pdf").forEach(btn => {
      btn.addEventListener("click", function () {
        const idx = this.getAttribute("data-index");
        const relatorio = relatorios[idx];
        const d = relatorio.denuncia;
        const nomeFicheiro = `${d.localizacao}_${d.categoria || "sem-categoria"}_${relatorio.dataGeracao.replace(/[: ]/g, "_")}.pdf`;
        gerarPDF(relatorio, nomeFicheiro);
      });
    });
  
    async function gerarPDF(relatorio, nomeFicheiro) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const d = relatorio.denuncia;
      
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
      
        // Peritos
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

      
        // Materiais
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
      
        // Total final
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
        y += 8;
      
        doc.save(nomeFicheiro);
      }   
         
  });
  