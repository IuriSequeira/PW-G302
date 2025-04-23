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
  
    // Atualizar DOM
    totalSpan.textContent = totalAtual;
    percentagemSpan.textContent = `${percentagem}%`;
  
    // Atualizar valor guardado para próxima sessão
    localStorage.setItem("denuncias_anterior", totalAtual);
  });
  