document.addEventListener("DOMContentLoaded", function() {
    carregarDenuncias();
  });
  
  let denuncias = JSON.parse(localStorage.getItem('denuncias')) || [];
  let denunciaSelecionadaIndex = null;
  
  function carregarDenuncias() {
    const tbodyAll = document.querySelector("#gestao-denuncia-all tbody");
    const tbodyPending = document.querySelector("#gestao-denuncia-pending tbody");
    const tbodyPaid = document.querySelector("#gestao-denuncia-paid tbody");
    const tbodyCancelled = document.querySelector("#gestao-denuncia-cancelled tbody");
  
    tbodyAll.innerHTML = "";
    tbodyPending.innerHTML = "";
    tbodyPaid.innerHTML = "";
    tbodyCancelled.innerHTML = "";
  
    denuncias.forEach((denuncia, index) => {
      inserirLinha(tbodyAll, denuncia, index);
      if (denuncia.estado === "analisar") {
        inserirLinha(tbodyPending, denuncia, index);
      } else if (denuncia.estado === "finalizada") {
        inserirLinha(tbodyPaid, denuncia, index);
      } else if (denuncia.estado === "cancelada") {
        inserirLinha(tbodyCancelled, denuncia, index);
      }
    });
  }
  
  function inserirLinha(tbody, denuncia, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="cell">#${index + 1}</td>
      <td class="cell"><span class="truncate">${denuncia.descricao}</span></td>
      <td class="cell">${denuncia.nome}</td>
      <td class="cell"><span>${formatarData(denuncia.data)}</span></td>
      <td class="cell"><span class="badge ${getBadgeClass(denuncia.estado)}">${formatarEstado(denuncia.estado)}</span></td>
      <td class="cell"><button class="btn-sm app-btn-secondary" onclick="verDetalhes(${index})">Ver</button></td>
    `;
    tbody.appendChild(tr);
  }
  
  function formatarData(dataStr) {
    const data = new Date(dataStr);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}`;
  }
  
  function getBadgeClass(estado) {
    if (estado === "analisar") return "bg-warning";
    if (estado === "finalizada") return "bg-success";
    if (estado === "cancelada") return "bg-danger";
  }
  
  function formatarEstado(estado) {
    if (estado === "analisar") return "Em Análise";
    if (estado === "finalizada") return "Finalizada";
    if (estado === "cancelada") return "Cancelada";
  }
  
  function verDetalhes(index) {
    const denuncia = denuncias[index];
    denunciaSelecionadaIndex = index;
  
    document.getElementById('detalheNome').textContent = denuncia.nome;
    document.getElementById('detalheEmail').textContent = denuncia.email;
    document.getElementById('detalheLocalizacao').textContent = denuncia.localizacao;
    document.getElementById('detalheDescricao').textContent = denuncia.descricao;
    document.getElementById('detalheData').textContent = formatarData(denuncia.data);
    document.getElementById('estadoDenuncia').value = denuncia.estado;
    
  
    const ficheirosContainer = document.getElementById('detalheFicheiros');
    ficheirosContainer.innerHTML = "";
  
    if (denuncia.ficheiros && denuncia.ficheiros.length > 0) {
      denuncia.ficheiros.forEach(ficheiro => {
        const div = document.createElement('div');
        div.className = "col-md-4";
  
        if (ficheiro.startsWith("data:image/")) {
          div.innerHTML = `<img src="${ficheiro}" class="img-fluid rounded shadow-sm mb-2" alt="Imagem">`;
        } else if (ficheiro.startsWith("data:video/")) {
          div.innerHTML = `<video controls class="img-fluid rounded shadow-sm mb-2"><source src="${ficheiro}"></video>`;
        } else {
          div.innerHTML = `<p class="text-muted">Ficheiro não suportado</p>`;
        }
  
        ficheirosContainer.appendChild(div);
      });
    } else {
      ficheirosContainer.innerHTML = "<p class='text-muted'>Nenhum ficheiro anexado.</p>";
    }
  
    const modal = new bootstrap.Modal(document.getElementById('modalDetalhesDenuncia'));
    modal.show();
  }
  
  document.getElementById('guardarEstadoBtn').addEventListener('click', function() {
    const novoEstado = document.getElementById('estadoDenuncia').value;
    if (denunciaSelecionadaIndex !== null) {
      denuncias[denunciaSelecionadaIndex].estado = novoEstado;
      localStorage.setItem('denuncias', JSON.stringify(denuncias));
      carregarDenuncias();
      const modal = bootstrap.Modal.getInstance(document.getElementById('modalDetalhesDenuncia'));
      modal.hide();
    }
  });
  