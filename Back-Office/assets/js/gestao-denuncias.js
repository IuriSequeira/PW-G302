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
      <td class="cell">${denuncia.categoria || '<span class="text-muted">-</span>'}</td>
      <td class="cell"><span class="truncate">${denuncia.descricao}</span></td>
      <td class="cell">${denuncia.nome}</td>
      <td class="cell"><span>${formatarData(denuncia.data)}</span></td>
      <td class="cell">${denuncia.grau ? `Grau ${denuncia.grau}` : '<span class="text-muted">-</span>'}</td>
      <td class="cell"><span class="badge ${getBadgeClass(denuncia.estado)}">${formatarEstado(denuncia.estado)}</span></td>
      <td class="cell"><button class="btn-sm app-btn-secondary" onclick="abrirAssociarMaterial(${index})">Materiais</button></td>
      <td class="cell"><button class="btn-sm app-btn-secondary" onclick="abrirAssociarPerito(${index})">Peritos</button></td>
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
  
  function verDetalhes(index, dadosAlternativos = null) {
    const denuncia = { ...denuncias[index] };
      // Se houver dados alternativos, aplica-os temporariamente
      if (dadosAlternativos) {
        if (dadosAlternativos.materiais) denuncia.materiais = dadosAlternativos.materiais;
        if (dadosAlternativos.perito) denuncia.perito = dadosAlternativos.perito;
      }

    denunciaSelecionadaIndex = index;
  
    // Preencher campos principais
    document.getElementById('detalheNome').textContent = denuncia.nome;
    document.getElementById('detalheEmail').textContent = denuncia.email;
    document.getElementById('detalheLocalizacao').textContent = denuncia.localizacao;
    document.getElementById('detalheCategoria').textContent = denuncia.categoria || "-";
    document.getElementById('detalheDescricao').textContent = denuncia.descricao;
    document.getElementById('detalheData').textContent = formatarData(denuncia.data);
    document.getElementById('estadoDenuncia').value = denuncia.estado;
    document.getElementById("grauImportancia").value = denuncia.grau || "";
  
    // Mostrar ficheiros
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
  
    // Mostrar Materiais, Perito e Total
    const peritoAssociado = document.getElementById('peritoAssociado');
    const listaMateriais = document.getElementById('listaMateriaisAssociados');
    const totalDenuncia = document.getElementById('totalDenuncia');
  
    listaMateriais.innerHTML = "";
    peritoAssociado.textContent = "";
    totalDenuncia.textContent = "";
  
    let total = 0;
  
    // Materiais associados
    const materiaisVisiveis = denuncia.materiais || denuncia.materiaisFinal;
    if (materiaisVisiveis && materiaisVisiveis.length > 0) {

      const materiaisStock = JSON.parse(localStorage.getItem("materiaisPorTipo")) || {};
  
      materiaisVisiveis.forEach(m => {
        const materialInfo = materiaisStock[m.tipo];
        const precoUnitario = materialInfo?.preco || 0;
        const subtotal = precoUnitario * m.quantidade;
        total += subtotal;
  
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = `${materialInfo?.nome || m.tipo} - ${m.quantidade} unidades - €${subtotal.toFixed(2)}`;
        listaMateriais.appendChild(li);
      });
    } else {
      listaMateriais.innerHTML = "<li class='list-group-item text-muted'>Nenhum material associado.</li>";
    }
  
      // Peritos associados
      const peritosVisiveis = denuncia.peritos || (denuncia.peritosFinal || []).map(p => p.nome);
      if (Array.isArray(peritosVisiveis) && peritosVisiveis.length > 0) {
        const peritos = JSON.parse(localStorage.getItem("peritos")) || [];
        const detalhes = peritosVisiveis.map(nome => {
          const info = peritos.find(p => p.nome === nome);
          const valor = info?.valor ? parseFloat(info.valor).toFixed(2) : "N/D";
          return `${nome} - €${valor}`;
        });
        peritoAssociado.innerHTML = detalhes.join("<br>");

        // Somar valores ao total
        detalhes.forEach(texto => {
          const match = texto.match(/€([\d,\.]+)/);
          const valor = match ? parseFloat(match[1].replace(',', '.')) : 0;
          if (!isNaN(valor)) total += valor;
        });
      } else {
        peritoAssociado.textContent = "Nenhum perito associado.";
      }

  
    // Mostrar Total
    totalDenuncia.textContent = `Total: €${total.toFixed(2)}`;
  
    // Abrir modal
    const modal = new bootstrap.Modal(document.getElementById('modalDetalhesDenuncia'));
    modal.show();
    
    const selectEstado = document.getElementById("estadoDenuncia");
    const explicacaoContainer = document.getElementById("explicacaoContainer");
    selectEstado.addEventListener("change", function () {
      explicacaoContainer.style.display = (this.value === "finalizada" || this.value === "cancelada") ? "block" : "none";
    });

    // Mostrar se já estiver em finalizada/cancelada
    explicacaoContainer.style.display = (selectEstado.value === "finalizada" || selectEstado.value === "cancelada") ? "block" : "none";

    // Atualizar selects de Peritos e Materiais
    preencherSelects();
  }  
  
  document.getElementById('guardarEstadoBtn').addEventListener('click', async function () {
    const novoEstado = document.getElementById('estadoDenuncia').value;
    const explicacao = document.getElementById('explicacaoFinal').value.trim();
    const novoGrau = document.getElementById("grauImportancia").value;
  
    if (denunciaSelecionadaIndex === null) return;
  
    const denuncias = JSON.parse(localStorage.getItem('denuncias')) || [];
    const materiaisStock = JSON.parse(localStorage.getItem("materiaisPorTipo")) || {};
    const peritos = JSON.parse(localStorage.getItem("peritos")) || [];
    const denuncia = denuncias[denunciaSelecionadaIndex];
  
    if ((novoEstado === "finalizada" || novoEstado === "cancelada") && explicacao === "") {
      alert("Por favor, escreve a explicação antes de finalizar ou cancelar a denúncia.");
      return;
    }

    denuncia.grau = novoGrau;
  
    // Guardar cópias para o relatório
    const materiaisUsados = denuncia.materiais ? JSON.parse(JSON.stringify(denuncia.materiais)) : [];
    const peritosUsados = Array.isArray(denuncia.peritos) ? denuncia.peritos : [];

    const peritosComValor = peritosUsados.map(nome => {
      const info = peritos.find(p => p.nome === nome);
      return {
        nome,
        valor: info?.valor ? parseFloat(info.valor) : 0
      };
    });

    const valorTotalPeritos = peritosComValor.reduce((soma, p) => soma + p.valor, 0);

  
    // Adicionar valor por material
    const materiaisComValor = materiaisUsados.map(m => {
      const info = materiaisStock[m.tipo] || {};
      return {
        tipo: m.tipo,
        quantidade: m.quantidade,
        valor: info.preco || 0
      };
    });
  
    // Criar relatório com dados completos
    const relatorio = {
      dataGeracao: new Date().toLocaleString(),
      estadoFinal: novoEstado,
      explicacao,
      denuncia: {
        ...denuncia,
        materiais: materiaisComValor,
        peritos: peritosComValor,
        valorTotalPeritos
      }

    };
  
    // Atualizar o estado da denúncia
    denuncia.estado = novoEstado;
  
    if (novoEstado === "finalizada" || novoEstado === "cancelada") {
      // Devolver materiais ao stock
      materiaisUsados.forEach(m => {
        if (!materiaisStock[m.tipo]) return;
        materiaisStock[m.tipo].quantidade += m.quantidade;
      });

  
      // Atualizar stock
      localStorage.setItem("materiaisPorTipo", JSON.stringify(materiaisStock));
  
      // Guardar relatório
      const relatorios = JSON.parse(localStorage.getItem("relatorios")) || [];
      relatorios.push(relatorio);
      localStorage.setItem("relatorios", JSON.stringify(relatorios));

      denuncia.materiaisFinal = materiaisComValor;
      denuncia.peritosFinal = peritosComValor;

        // Limpar materiais e peritos da denúncia original
        delete denuncia.materiais;
        delete denuncia.peritos;
    }
  
    // Guardar alterações da denúncia
    localStorage.setItem("denuncias", JSON.stringify(denuncias));
    carregarDenuncias();
  
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalDetalhesDenuncia'));
    modal.hide();
  
    setTimeout(() => {
      verDetalhes(denunciaSelecionadaIndex, {
        materiais: materiaisUsados,
      });
    }, 300);
  
    alert("Denúncia atualizada e relatório final gerado com sucesso.");
  });  

function abrirAssociarPerito(index) {
  denunciaSelecionadaIndex = index;
  const denuncia = denuncias[index];

  document.getElementById('modalAssociarPeritoTitulo').textContent = `Associar Perito à denúncia #${index + 1}`;
  document.getElementById('selectPerito').value = '';

  // Atualizar lista de peritos já associados
  const listaUl = document.getElementById("listaPeritosAssociados");
  listaUl.innerHTML = "";

  if (Array.isArray(denuncia.peritos) && denuncia.peritos.length > 0) {
    denuncia.peritos.forEach(nome => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = nome;
      listaUl.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.className = "list-group-item text-muted";
    li.textContent = "Nenhum perito associado.";
    listaUl.appendChild(li);
  }

  const modal = new bootstrap.Modal(document.getElementById('modalAssociarPerito'));
  modal.show();
}

  
  function abrirAssociarMaterial(index) {
    denunciaSelecionadaIndex = index;
    const modal = new bootstrap.Modal(document.getElementById('modalAssociarMaterial'));
    modal.show();
  }  

  function preencherSelects() {
    const peritos = JSON.parse(localStorage.getItem("peritos")) || [];
    const materiais = JSON.parse(localStorage.getItem("materiaisPorTipo")) || {};
  
    const selectPerito = document.getElementById("selectPerito");
    const selectMaterial = document.getElementById("selectMaterial");
  
    selectPerito.innerHTML = '<option value="">-- Nenhum --</option>' + peritos.map(perito => `<option value="${perito.nome}">${perito.nome}</option>`).join('');

    selectMaterial.innerHTML = Object.keys(materiais).map(key => `<option value="${key}">${materiais[key].nome}</option>`).join('');
  }
  document.getElementById("modalAssociarPerito").addEventListener("show.bs.modal", preencherSelects);
  
document.getElementById("btnAssociarPerito").addEventListener("click", function () {
  const peritoSelecionado = document.getElementById("selectPerito").value;

  if (!peritoSelecionado) {
    alert("Seleciona um perito válido.");
    return;
  }

  if (denunciaSelecionadaIndex !== null) {
    const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];
    const denuncia = denuncias[denunciaSelecionadaIndex];

    // Inicializa o array se não existir
    if (!Array.isArray(denuncia.peritos)) {
      denuncia.peritos = [];
    }

    // Verifica se já está associado
    if (denuncia.peritos.includes(peritoSelecionado)) {
      alert("Este perito já está associado a esta denúncia.");
      return;
    }

    // Verifica limite de 3 por perito no total
    const totalDoPerito = denuncias.filter(d => Array.isArray(d.peritos) && d.peritos.includes(peritoSelecionado)).length;
    if (totalDoPerito >= 3) {
      alert(`O perito "${peritoSelecionado}" já está associado ao máximo de 3 denúncias.`);
      return;
    }

    // Associa
    denuncia.peritos.push(peritoSelecionado);

    localStorage.setItem("denuncias", JSON.stringify(denuncias));
    carregarDenuncias();

    alert("Perito associado com sucesso!");

    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAssociarPerito'));
    modal.hide();
  }
});
  
  
  document.getElementById("btnAssociarMaterial").addEventListener("click", function () {
    const materialSelecionado = document.getElementById("selectMaterial").value;
    const quantidade = parseInt(document.getElementById("quantidadeMaterial").value, 10);
    const materiais = JSON.parse(localStorage.getItem("materiaisPorTipo")) || {};
    const denuncia = denuncias[denunciaSelecionadaIndex];
  
    if (!materialSelecionado || isNaN(quantidade)) {
      alert("Insere uma quantidade válida.");
      return;
    }
  
    if (!denuncia.materiais) denuncia.materiais = [];
    const existente = denuncia.materiais.find(m => m.tipo === materialSelecionado);
  
    // REMOVER MATERIAL
    if (quantidade < 0) {
      if (existente && existente.quantidade >= Math.abs(quantidade)) {
        existente.quantidade += quantidade; // quantidade negativa
        materiais[materialSelecionado].quantidade -= quantidade; // adicionar ao stock
        if (existente.quantidade === 0) {
          denuncia.materiais = denuncia.materiais.filter(m => m.tipo !== materialSelecionado);
        }
        alert("Material removido com sucesso!");
      } else {
        alert("Não há quantidade suficiente desse material para remover.");
        return;
      }
    }
    // ADICIONAR MATERIAL
    else {
      if (!materiais[materialSelecionado] || materiais[materialSelecionado].quantidade < quantidade) {
        alert("Não há materiais suficientes em stock.");
        return;
      }
  
      if (existente) {
        existente.quantidade += quantidade;
      } else {
        denuncia.materiais.push({ tipo: materialSelecionado, quantidade });
      }
      materiais[materialSelecionado].quantidade -= quantidade;
      alert("Material associado com sucesso!");
    }
  
    localStorage.setItem("materiaisPorTipo", JSON.stringify(materiais));
    localStorage.setItem("denuncias", JSON.stringify(denuncias));
  });
  