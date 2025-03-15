document.addEventListener('DOMContentLoaded', function() {
  // Definir o número total de denúncias feitas
  var totalDenuncias = 250; // Substituir por um valor dinâmico se necessário
  var totalDenunciasElement = document.getElementById('totalDenuncias');
  if (totalDenunciasElement) {
    totalDenunciasElement.textContent = totalDenuncias;
  }

  // Função para criar gráficos apenas se o canvas existir no HTML
  function createChart(id, type, data, options = {}) {
    var canvas = document.getElementById(id);
    if (canvas) {
      var ctx = canvas.getContext('2d');
      return new Chart(ctx, { type, data, options });
    }
    return null;
  }

  // Gráfico: Denúncias ao longo do tempo
  createChart('denunciasTempoChart', 'line', {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [{
      label: 'Denúncias Mensais',
      data: [10, 15, 20, 18, 25, 30, 45, 50, 40, 60, 70, 80],
      backgroundColor: 'rgba(163, 255, 237, 0.2)',
      borderColor: '#20c997',
      borderWidth: 2,
      fill: true,
      tension: 0.3
    }]
  }, { responsive: true, scales: { y: { beginAtZero: true } } });

  // Gráfico: Tipo de Denúncias Registadas
  createChart('tipoDenunciasChart', 'pie', {
    datasets: [{
      data: [25, 20, 15, 15, 20, 20, 30, 25], 
      backgroundColor: [
        '#E6194B', '#3CB44B', '#FFE119', '#4363D8', 
        '#F58231', '#911EB4', 
        '#42D4F4', '#F032E6'  
      ]
    }]
  });

  // Gráfico: Número de Auditorias Realizadas
  createChart('auditoriasRealizadasChart', 'doughnut', {
    labels: ['Realizadas', 'Solicitadas'],
    datasets: [{
      data: [150, 50],
      backgroundColor: ['#28a745', '#ff6347']
    }]
  });

  // Gráfico: Tipos de Denúncias Resolvidas
  createChart('denunciasResolvidasChart', 'pie', {
    datasets: [{
      data: [25, 20, 15, 15, 20, 20, 30, 25], 
      backgroundColor: [
        '#E6194B', '#3CB44B', '#FFE119', '#4363D8',
        '#F58231', '#911EB4', 
        '#42D4F4', '#F032E6'  
      ]
    }]
  });



    // Exemplo de dados de tempo de resposta para denúncias (em dias) e suas datas
    const denuncias = [
      { id: 1, tempo_resposta: 5, mes: 'Jan' },
      { id: 2, tempo_resposta: 3, mes: 'Jan' },
      { id: 3, tempo_resposta: 6, mes: 'Feb' },
      { id: 4, tempo_resposta: 4, mes: 'Feb' },
      { id: 5, tempo_resposta: 8, mes: 'Mar' },
      { id: 6, tempo_resposta: 2, mes: 'Mar' },
      { id: 7, tempo_resposta: 5, mes: 'Jan' },
      { id: 8, tempo_resposta: 3, mes: 'Feb' },
      { id: 9, tempo_resposta: 4, mes: 'Mar' },
      { id: 10, tempo_resposta: 7, mes: 'Mar' }
    ];
  
    // Função para calcular a média de tempo de resposta por mês
    function calcularMediaTempoPorMes(denuncias) {
      const tempoPorMes = {};
  
      // Agrupar os tempos de resposta por mês
      denuncias.forEach(denuncia => {
        if (!tempoPorMes[denuncia.mes]) {
          tempoPorMes[denuncia.mes] = [];
        }
        tempoPorMes[denuncia.mes].push(denuncia.tempo_resposta);
      });
  
      // Calcular a média para cada mês
      const mediasPorMes = Object.keys(tempoPorMes).map(mes => {
        const totalTempo = tempoPorMes[mes].reduce((soma, tempo) => soma + tempo, 0);
        const media = totalTempo / tempoPorMes[mes].length;
        return { mes, media };
      });
  
      return mediasPorMes;
    }
  
    // Calcular as médias de tempo de resposta por mês
    const mediasTempoPorMes = calcularMediaTempoPorMes(denuncias);
    const mediasMap = mediasTempoPorMes.reduce((acc, item) => {
      acc[item.mes] = item.media;
      return acc;
    }, {});
  
    // Obter todos os meses do ano
    const mesesAno = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
    // Obter o mês atual
    const mesAtual = new Date().toLocaleString('default', { month: 'short' });
  
    // Criar o array de meses e dados de médias, substituindo os dados do mês atual
    const meses = mesesAno;
    const medias = mesesAno.map(mes => mediasMap[mes] || null); // Usar os valores calculados para cada mês, ou null se não houver dados
  
    // Preencher a última posição com o valor do mês atual se não estiver presente
    if (!medias[meses.indexOf(mesAtual)]) {
      medias[meses.indexOf(mesAtual)] = mediasMap[mesAtual] || null;
    }
  
    // Exemplo de como apresentar as médias no console
    console.log("Média de Tempo de Resposta por Mês:", mediasTempoPorMes);
  
    // Criar gráfico de tempo médio de resposta por mês
    createChart('tempoMedioRespostaChart', 'line', {
      labels: meses, // Meses
      datasets: [{
        label: 'Tempo Médio de Resposta (em dias)', // Título do gráfico
        data: medias, // Dados de tempo médio de resposta por mês
        borderColor: '#20c997',  // Cor de fundo suave
        backgroundColor: 'rgba(163, 255, 237, 0.2)', // Cor da linha
        borderWidth: 2,
        fill: true, // Preenchimento da área abaixo da linha
        tension: 0.4  // Suavização da linha
      }]
    }, {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Meses'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Tempo (em dias)'
          },
          beginAtZero: true
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw.toFixed(2)} dias`; // Exibe o tempo médio de resposta
            }
          }
        },
        legend: {
          position: 'top',
        }
      },
      animation: {
        duration: 1000, // Animação suave de 1 segundo
      }
    });

});