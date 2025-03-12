document.addEventListener('DOMContentLoaded', function() {
    // Gráfico: Número de Denúncias Feitas no Sistema
    var ctx1 = document.getElementById('denunciasFeitasChart').getContext('2d');
    var denunciasFeitasChart = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['Total de Denúncias'],
        datasets: [{
          label: 'Denúncias Feitas',
          data: [250],  // Exemplo de valor, substitua conforme necessário
          backgroundColor: ['#007bff'],
          borderColor: ['#0056b3'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  
    // Gráfico: Tipo de Denúncias Registradas
    var ctx2 = document.getElementById('tipoDenunciasChart').getContext('2d');
    var tipoDenunciasChart = new Chart(ctx2, {
      type: 'pie',
      data: {
        labels: ['Auditorias', 'Monitorização', 'Incidentes'],
        datasets: [{
          data: [100, 120, 80], // Exemplo de valores
          backgroundColor: ['#ff6347', '#4caf50', '#ffc107']
        }]
      }
    });
  
    // Gráfico: Número de Auditorias Realizadas
    var ctx3 = document.getElementById('auditoriasRealizadasChart').getContext('2d');
    var auditoriasRealizadasChart = new Chart(ctx3, {
      type: 'doughnut',
      data: {
        labels: ['Realizadas', 'Solicitadas'],
        datasets: [{
          data: [150, 50], // Exemplo de valores
          backgroundColor: ['#28a745', '#ff6347']
        }]
      }
    });
  
    // Gráfico: Tipos de Auditorias Resolvidas
    var ctx4 = document.getElementById('auditoriasResolvidasChart').getContext('2d');
    var auditoriasResolvidasChart = new Chart(ctx4, {
      type: 'bar',
      data: {
        labels: ['Auditoria da Qualidade do Ar', 'Monitorização', 'Incidentes'],
        datasets: [{
          label: 'Auditorias Resolvidas',
          data: [60, 80, 40], // Exemplo de valores
          backgroundColor: ['#28a745', '#17a2b8', '#ffc107'],
          borderColor: ['#218838', '#138496', '#e0a800'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  
    // Gráfico: Tempo Médio de Resposta
    var ctx5 = document.getElementById('tempoMedioRespostaChart').getContext('2d');
    var tempoMedioRespostaChart = new Chart(ctx5, {
      type: 'line',
      data: {
        labels: ['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5'], // Exemplo de datas
        datasets: [{
          label: 'Tempo Médio de Resposta',
          data: [30, 40, 50, 60, 70], // Exemplo de valores de tempo em minutos
          borderColor: '#007bff',
          borderWidth: 2,
          fill: false
        }]
      }
    });
  });
  