// stats.js unificado com estatisticas.js + index-charts.js

// --- Estatísticas Totais e Percentagens ---
document.addEventListener("DOMContentLoaded", function () {
  const totalSpan = document.getElementById("total-denuncias");
  const percentagemSpan = document.getElementById("percentagem-denuncias");
  const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];

  const totalAtual = denuncias.length;
  const totalAnterior = parseInt(localStorage.getItem("denuncias_anterior")) || 0;
  const diferenca = totalAtual - totalAnterior;
  const percentagem = totalAnterior > 0 ? Math.round((diferenca / totalAnterior) * 100) : 0;

  if (totalSpan) totalSpan.textContent = totalAtual;
  if (percentagemSpan) percentagemSpan.textContent = `${percentagem}%`;

  if (!sessionStorage.getItem("sessao_iniciada")) {
    sessionStorage.setItem("sessao_iniciada", "true");
    localStorage.setItem("denuncias_anterior", totalAtual);
  }
});

// --- Estatísticas por Estado ---
document.addEventListener("DOMContentLoaded", function () {
  const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];

  const total = denuncias.length;
  const emAnalise = denuncias.filter(d => d.estado === "analisar").length;
  const finalizadas = denuncias.filter(d => d.estado === "finalizada").length;
  const canceladas = denuncias.filter(d => d.estado === "cancelada").length;

  const analiseDiv = document.getElementById("estatistica-analise");
  const finalizadasDiv = document.getElementById("estatistica-finalizadas");
  const canceladasDiv = document.getElementById("estatistica-canceladas");
  const analisePct = document.getElementById("percentagem-analise");
  const finalizadasPct = document.getElementById("percentagem-finalizadas");
  const canceladasPct = document.getElementById("percentagem-canceladas");

  if (analiseDiv) analiseDiv.textContent = emAnalise;
  if (finalizadasDiv) finalizadasDiv.textContent = finalizadas;
  if (canceladasDiv) canceladasDiv.textContent = canceladas;

  const formatPct = (v) => total > 0 ? `${Math.round((v / total) * 100)}% do total` : "0% do total";

  if (analisePct) analisePct.textContent = formatPct(emAnalise);
  if (finalizadasPct) finalizadasPct.textContent = formatPct(finalizadas);
  if (canceladasPct) canceladasPct.textContent = formatPct(canceladas);
});

// --- Gráfico de Linhas: Denúncias por Dia ---
document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("grafico-denuncias")?.getContext("2d");
  if (!ctx) return;

  const filtro = document.getElementById("filtro-tempo");
  if (!filtro) return;

  filtro.value = "mes";
  let chart;

  function formatarDataISO(dataStr) {
    const data = new Date(dataStr);
    return data.toISOString().split("T")[0];
  }

  function obterDatasFiltradas(denuncias, periodo) {
    const agora = new Date();
    return denuncias.filter(d => {
      const data = new Date(d.data);
      switch (periodo) {
        case "hoje": return data.toDateString() === agora.toDateString();
        case "semana":
          const inicioSemana = new Date(agora);
          inicioSemana.setDate(agora.getDate() - agora.getDay());
          inicioSemana.setHours(0, 0, 0, 0);
          return data >= inicioSemana && data <= agora;
        case "mes": return data.getMonth() === agora.getMonth() && data.getFullYear() === agora.getFullYear();
        case "ano": return data.getFullYear() === agora.getFullYear();
        default: return true;
      }
    }).map(d => d.data);
  }

  function contarPorData(datas) {
    const contagem = {};
    datas.forEach(data => {
      const dia = formatarDataISO(data);
      contagem[dia] = (contagem[dia] || 0) + 1;
    });
    const labels = Object.keys(contagem).sort();
    const valores = labels.map(label => contagem[label]);
    return { labels, valores };
  }

  function atualizarGrafico() {
    const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];
    const periodo = filtro.value;
    const datasFiltradas = obterDatasFiltradas(denuncias, periodo);
    const { labels, valores } = contarPorData(datasFiltradas);

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Denúncias por Dia',
          data: valores,
          borderColor: '#00D9A5',
          backgroundColor: 'rgba(0, 217, 165, 0.2)',
          pointBackgroundColor: '#059c7a',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          x: { title: { display: true, text: "Data" } },
          y: {
            beginAtZero: true,
            title: { display: true, text: "Nº de Denúncias" },
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  }

  filtro.addEventListener("change", atualizarGrafico);
  atualizarGrafico();
});

// --- Gráficos Vue (Doughnut, Radar, Categorias) ---
const { createApp, onMounted } = Vue;

// Doughnut
createApp({ setup() {
  onMounted(() => {
    const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];
    const emAnalise = denuncias.filter(d => d.estado === "analisar").length;
    const finalizadas = denuncias.filter(d => d.estado === "finalizada").length;
    const canceladas = denuncias.filter(d => d.estado === "cancelada").length;

    const ctx = document.getElementById("canvas-doughnut")?.getContext("2d");
    if (!ctx) return;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["Em Análise", "Finalizadas", "Canceladas"],
        datasets: [{
          data: [emAnalise, finalizadas, canceladas],
          backgroundColor: ["#f6c23e", "#1cc88a", "#e74a3b"]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const total = emAnalise + finalizadas + canceladas;
                const percent = total ? Math.round((ctx.raw / total) * 100) : 0;
                return `${ctx.label}: ${ctx.raw} (${percent}%)`;
              }
            }
          }
        }
      }
    });
  });
}}).mount("#grafico-estado-auditorias");

// Radar
createApp({ setup() {
  onMounted(() => {
    const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];
    const categorias = {};

    denuncias.forEach(d => {
      const cat = d.categoria || "Desconhecida";
      if (!categorias[cat]) categorias[cat] = { casos: 0, materiais: 0, grauTotal: 0, grauCount: 0 };
      categorias[cat].casos++;

      const materiais = d.materiais || d.materiaisFinal || [];
      materiais.forEach(m => categorias[cat].materiais += m.quantidade || 0);

      const grau = parseInt(d.grau);
      if (!isNaN(grau)) {
        categorias[cat].grauTotal += grau;
        categorias[cat].grauCount++;
      }
    });

    const labels = Object.keys(categorias);
    const casos = labels.map(cat => categorias[cat].casos);
    const materiais = labels.map(cat => categorias[cat].materiais);
    const grausMedios = labels.map(cat => {
      const c = categorias[cat];
      return c.grauCount ? (c.grauTotal / c.grauCount).toFixed(2) : 0;
    });

    const ctx = document.getElementById("canvas-perfil")?.getContext("2d");
    if (!ctx) return;

    new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [
          { label: 'Casos', data: casos, backgroundColor: 'rgba(78, 115, 223, 0.2)', borderColor: '#4e73df' },
          { label: 'Materiais', data: materiais, backgroundColor: 'rgba(28, 200, 138, 0.2)', borderColor: '#1cc88a' },
          { label: 'Grau Médio', data: grausMedios, backgroundColor: 'rgba(246, 194, 62, 0.2)', borderColor: '#f6c23e' }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: {
          r: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              callback: v => Number.isInteger(v) ? v : v.toFixed(1)
            }
          }
        }
      }
    });
  });
}}).mount("#grafico-perfil");

// Categorias (Doughnut)
createApp({ setup() {
  onMounted(() => {
    const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];
    const categorias = {};
    denuncias.forEach(d => {
      const c = (d.categoria || "").trim().toLowerCase();
      if (!c) return;
      categorias[c] = (categorias[c] || 0) + 1;
    });

    const ordenadas = Object.entries(categorias).sort((a, b) => b[1] - a[1]);
    const labels = ordenadas.map(([cat]) => cat.charAt(0).toUpperCase() + cat.slice(1));
    const dados = ordenadas.map(([, count]) => count);
    const cores = labels.map((_, i) => `hsl(${i * 60 % 360}, 70%, 60%)`);

    const ctx = document.getElementById("canvas-categorias")?.getContext("2d");
    if (!ctx) return;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data: dados, backgroundColor: cores }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: ctx => {
                const total = dados.reduce((a, b) => a + b, 0);
                const percent = total ? Math.round((ctx.raw / total) * 100) : 0;
                return `${ctx.label}: ${ctx.raw} (${percent}%)`;
              }
            }
          }
        }
      }
    });
  });
}}).mount("#grafico-categorias");