//Total de denuncias
document.addEventListener("DOMContentLoaded", function () {
    const totalSpan = document.getElementById("total-denuncias");
  
    const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];
  
    totalSpan.textContent = denuncias.length;
  });

// percentagem de denuncias com base em acessos
document.addEventListener("DOMContentLoaded", function () {
    const totalSpan = document.getElementById("total-denuncias");
    const percentagemSpan = document.getElementById("percentagem-denuncias");
  
    const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];
    const totalAtual = denuncias.length;
  
    const totalAnterior = parseInt(localStorage.getItem("denuncias_anterior")) || 0;
    const diferenca = totalAtual - totalAnterior;
    const percentagem = totalAnterior > 0 ? Math.round((diferenca / totalAnterior) * 100) : 0;
  
    // Mostrar valores no dashboard
    totalSpan.textContent = totalAtual;
    percentagemSpan.textContent = `${percentagem}%`;
  
    if (!sessionStorage.getItem("sessao_iniciada")) {
      // Marcar que a sessão já começou
      sessionStorage.setItem("sessao_iniciada", "true");
  
      // Atualiza o valor de "último total" APENAS uma vez por sessão
      localStorage.setItem("denuncias_anterior", totalAtual);
    }
  });
  
// Gráfico de linhas de denuncias por dias 
document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("grafico-denuncias").getContext("2d");
    const filtro = document.getElementById("filtro-tempo");
    filtro.value = "mes";
    let chart;
  
    function formatarDataISO(dataStr) {
      const data = new Date(dataStr);
      return data.toISOString().split("T")[0];
    }
  
    function obterDatasFiltradas(denuncias, periodo) {
      const agora = new Date();
      return denuncias
        .filter(d => {
          const data = new Date(d.data);
          switch (periodo) {
            case "hoje":
              return data.toDateString() === agora.toDateString();
            case "semana":
              const inicioSemana = new Date(agora);
              inicioSemana.setDate(agora.getDate() - agora.getDay());
              inicioSemana.setHours(0, 0, 0, 0);
              return data >= inicioSemana && data <= agora;
            case "mes":
              return data.getMonth() === agora.getMonth() && data.getFullYear() === agora.getFullYear();
            case "ano":
              return data.getFullYear() === agora.getFullYear();
            default:
              return true;
          }
        })
        .map(d => d.data);
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
            pointBorderColor: '#00D9A5',
            pointHoverBackgroundColor: '#059c7a',
            pointHoverBorderColor: '#00D9A5',
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
            x: {
              title: { display: true, text: "Data" }
            },
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
    atualizarGrafico(); // inicialização
  });  