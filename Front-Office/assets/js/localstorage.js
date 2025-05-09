// Ficheiro: assets/js/localStorage.js

window.addEventListener("DOMContentLoaded", function () {
  function guardarEmLocalStorage(chave, objeto) {
    const lista = JSON.parse(localStorage.getItem(chave)) || [];
    lista.push(objeto);
    localStorage.setItem(chave, JSON.stringify(lista));
  }

  const denunciaForm = document.querySelector("#denuncia-form");

  function atualizarEstadoFormulario() {
    const contador = document.getElementById("contador-denuncias");
    const botaoSubmeter = document.querySelector("#denuncia-form button[type='submit']");

    const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];
    const emAnalise = denuncias.filter(d => d.estado === "analisar");
    const restantes = 15 - emAnalise.length;

    if (contador) {
      if (restantes <= 0) {
        contador.textContent = "Neste momento não é possível submeter novas denúncias. Aguarde por disponibilidade.";
        contador.classList.remove("alert-info");
        contador.classList.add("alert-warning");
        botaoSubmeter.disabled = true;
        botaoSubmeter.classList.add("disabled");
      } else {
        contador.textContent = `Restam ${restantes} vaga${restantes > 1 ? 's' : ''} para denúncias em análise.`;
        contador.classList.remove("alert-warning");
        contador.classList.add("alert-info");
        botaoSubmeter.disabled = false;
        botaoSubmeter.classList.remove("disabled");
      }
    }
  }

  atualizarEstadoFormulario(); // Executa ao carregar a página

  if (denunciaForm) {
    denunciaForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];
      const emAnalise = denuncias.filter(d => d.estado === "analisar");

      if (emAnalise.length >= 15) {
        mostrarMensagem("Limite Atingido", "Neste momento não é possível submeter a sua denúncia. Por favor, esteja atento ao site para quando houver disponibilidade.", "bg-warning");
        return;
      }

      try {
        const data = await getDenunciaFormData();
        const codigoPostal = data.codPostal.trim();

        if (!(codigoPostal.startsWith("47") || codigoPostal.startsWith("48"))) {
          mostrarMensagem("Erro", "A EyesEverywhere apenas atua no distrito de Braga.", "bg-danger");
          return;
        }

        data.estado = "analisar";
        guardarEmLocalStorage("denuncias", data);
        mostrarMensagem("Sucesso", "Denúncia guardada com sucesso!", "bg-success");
        denunciaForm.reset();
        atualizarEstadoFormulario(); // Atualiza o contador após submissão
      } catch (err) {
        console.error("Erro ao ler ficheiros:", err);
      }
    });

    function getDenunciaFormData() {
      return new Promise((resolve, reject) => {
        const data = {};
        const formElements = denunciaForm.elements;

        for (const element of formElements) {
          if (element.name && element.type !== "file") {
            data[element.name] = element.value;
          }
        }

        const ficheirosInput = document.getElementById("ficheiros");
        const ficheiros = ficheirosInput ? ficheirosInput.files : [];
        data.ficheiros = [];

        data.perito = "";     // Inicializar campo Perito vazio
        data.materiais = "";  // Inicializar campo Materiais vazio

        if (ficheiros.length === 0) {
          resolve(data);
        } else {
          let lidos = 0;
          Array.from(ficheiros).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
              data.ficheiros.push(e.target.result);
              lidos++;
              if (lidos === ficheiros.length) resolve(data);
            };
            reader.onerror = function (err) {
              reject(err);
            };
            reader.readAsDataURL(file);
          });
        }
      });
    }

    function mostrarMensagem(titulo, mensagem, corCabecalho) {
      document.getElementById("mensagemModalLabel").textContent = titulo;
      document.getElementById("mensagemModalBody").textContent = mensagem;
      const header = document.querySelector("#mensagemModal .modal-header");
      header.className = "modal-header " + corCabecalho + " text-white";
      $('#mensagemModal').modal('show');
    }
  }
});
