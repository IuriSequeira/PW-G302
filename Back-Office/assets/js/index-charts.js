'use strict';

window.chartColors = {
	green: '#75c181',
	gray: '#a9b5c9',
	text: '#252930',
	border: '#e7e9ed'
};

/* Random number generator for demo purpose */
var randomDataPoint = function(){ return Math.round(Math.random()*10000)};


//Chart.js Line Chart Example 

var lineChartConfig = {
	type: 'line',

	data: {
		labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
		
		datasets: [{
			label: 'Current week',
			fill: false,
			backgroundColor: window.chartColors.green,
			borderColor: window.chartColors.green,
			data: [
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint()
			],
		}, {
			label: 'Previous week',
		    borderDash: [3, 5],
			backgroundColor: window.chartColors.gray,
			borderColor: window.chartColors.gray,
			
			data: [
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint()
			],
			fill: false,
		}]
	},
	options: {
		responsive: true,	
		aspectRatio: 1.5,
		
		legend: {
			display: true,
			position: 'bottom',
			align: 'end',
		},
		
		title: {
			display: true,
			text: 'Chart.js Line Chart Example',
			
		}, 
		tooltips: {
			mode: 'index',
			intersect: false,
			titleMarginBottom: 10,
			bodySpacing: 10,
			xPadding: 16,
			yPadding: 16,
			borderColor: window.chartColors.border,
			borderWidth: 1,
			backgroundColor: '#fff',
			bodyFontColor: window.chartColors.text,
			titleFontColor: window.chartColors.text,

            callbacks: {
	            //Ref: https://stackoverflow.com/questions/38800226/chart-js-add-commas-to-tooltip-and-y-axis
                label: function(tooltipItem, data) {
	                if (parseInt(tooltipItem.value) >= 1000) {
                        return "$" + tooltipItem.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    } else {
	                    return '$' + tooltipItem.value;
                    }
                }
            },

		},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		scales: {
			xAxes: [{
				display: true,
				gridLines: {
					drawBorder: false,
					color: window.chartColors.border,
				},
				scaleLabel: {
					display: false,
				
				}
			}],
			yAxes: [{
				display: true,
				gridLines: {
					drawBorder: false,
					color: window.chartColors.border,
				},
				scaleLabel: {
					display: false,
				},
				ticks: {
		            beginAtZero: true,
		            userCallback: function(value, index, values) {
		                return '$' + value.toLocaleString();   //Ref: https://stackoverflow.com/questions/38800226/chart-js-add-commas-to-tooltip-and-y-axis
		            }
		        },
			}]
		}
	}
};



// Chart.js Bar Chart Example 

var barChartConfig = {
	type: 'bar',

	data: {
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		datasets: [{
			label: 'Orders',
			backgroundColor: window.chartColors.green,
			borderColor: window.chartColors.green,
			borderWidth: 1,
			maxBarThickness: 16,
			
			data: [
				23,
				45,
				76,
				75,
				62,
				37,
				83
			]
		}]
	},
	options: {
		responsive: true,
		aspectRatio: 1.5,
		legend: {
			position: 'bottom',
			align: 'end',
		},
		title: {
			display: true,
			text: 'Chart.js Bar Chart Example'
		},
		tooltips: {
			mode: 'index',
			intersect: false,
			titleMarginBottom: 10,
			bodySpacing: 10,
			xPadding: 16,
			yPadding: 16,
			borderColor: window.chartColors.border,
			borderWidth: 1,
			backgroundColor: '#fff',
			bodyFontColor: window.chartColors.text,
			titleFontColor: window.chartColors.text,

		},
		scales: {
			xAxes: [{
				display: true,
				gridLines: {
					drawBorder: false,
					color: window.chartColors.border,
				},

			}],
			yAxes: [{
				display: true,
				gridLines: {
					drawBorder: false,
					color: window.chartColors.borders,
				},

				
			}]
		}
		
	}
}

// Generate charts on load
window.addEventListener('load', function(){
	
	var lineChart = document.getElementById('canvas-linechart').getContext('2d');
	window.myLine = new Chart(lineChart, lineChartConfig);
	
	var barChart = document.getElementById('canvas-barchart').getContext('2d');
	window.myBar = new Chart(barChart, barChartConfig);
	

});	
	
window.addEventListener("DOMContentLoaded", function () {
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

  // Mostrar percentagens com números inteiros
  const formatPct = (v) => total > 0 ? `${Math.round((v / total) * 100)}% do total` : "0% do total";

  if (analisePct) analisePct.textContent = formatPct(emAnalise);
  if (finalizadasPct) finalizadasPct.textContent = formatPct(finalizadas);
  if (canceladasPct) canceladasPct.textContent = formatPct(canceladas);
});

// Vue + Chart.js Doughnut Chart para Estado das Auditorias
const { createApp, onMounted } = Vue;

createApp({
  setup() {
    onMounted(() => {
      const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];

      const emAnalise = denuncias.filter(d => d.estado === "analisar").length;
      const finalizadas = denuncias.filter(d => d.estado === "finalizada").length;
      const canceladas = denuncias.filter(d => d.estado === "cancelada").length;

      const ctx = document.getElementById("canvas-doughnut").getContext("2d");

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
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const total = emAnalise + finalizadas + canceladas;
                  const percent = total > 0 ? Math.round((context.raw / total) * 100) : 0;
                  return `${context.label}: ${context.raw} (${percent}%)`;
                }
              }
            }
          }
        }
      });
    });
  }
}).mount("#grafico-estado-auditorias");


// Vue + Chart.js Gráfico de Radar por Perfil
createApp({
  setup() {
    onMounted(() => {
      const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];

      // Perfil genérico por tipo (exemplo: quantidade, urgência fictícia, etc.)
      const tipos = {};
      denuncias.forEach(d => {
        const cat = d.categoria || "Desconhecida";
        if (!tipos[cat]) tipos[cat] = { total: 0, urgencia: 0, materiais: 0 };
        tipos[cat].total++;
        if (d.urgente === "sim") tipos[cat].urgencia++;
        if (Array.isArray(d.materiais)) tipos[cat].materiais += d.materiais.length;
      });

      const labels = Object.keys(tipos);
      const totais = labels.map(l => tipos[l].total);
      const urgencias = labels.map(l => tipos[l].urgencia);
      const materiais = labels.map(l => tipos[l].materiais);

      const ctx = document.getElementById("canvas-perfil").getContext("2d");

      new Chart(ctx, {
        type: 'radar',
        data: {
          labels,
          datasets: [
            {
              label: 'Total',
              data: totais,
              backgroundColor: 'rgba(78, 115, 223, 0.2)',
              borderColor: '#4e73df'
            },
            {
              label: 'Urgentes',
              data: urgencias,
              backgroundColor: 'rgba(231, 74, 59, 0.2)',
              borderColor: '#e74a3b'
            },
            {
              label: 'Materiais',
              data: materiais,
              backgroundColor: 'rgba(28, 200, 138, 0.2)',
              borderColor: '#1cc88a'
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' }
          },
          scales: {
            r: {
              beginAtZero: true,
              ticks: { stepSize: 1 }
            }
          }
        }
      });
    });
  }
}).mount("#grafico-perfil");


createApp({
  setup() {
    onMounted(() => {
      const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];

      const categorias = {};
      denuncias.forEach(d => {
        const categoria = (d.categoria || "").trim().toLowerCase();
        if (!categoria) return;
        categorias[categoria] = (categorias[categoria] || 0) + 1;
      });

      const ordenadas = Object.entries(categorias).sort((a, b) => b[1] - a[1]);
      const labels = ordenadas.map(([cat]) => cat.charAt(0).toUpperCase() + cat.slice(1));
      const dados = ordenadas.map(([, count]) => parseInt(count, 10));
      const cores = labels.map((_, i) => `hsl(${i * 60 % 360}, 70%, 60%)`);

      const ctx = document.getElementById("canvas-categorias").getContext("2d");

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            label: 'Distribuição por Categoria',
            data: dados,
            backgroundColor: cores
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: (ctx) => {
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
  }
}).mount("#grafico-categorias");