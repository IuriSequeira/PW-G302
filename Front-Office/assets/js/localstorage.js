// Ficheiro: assets/js/localStorage.js

window.addEventListener("DOMContentLoaded", function () {

  // --------------------------
  // Funções genéricas comuns
  // --------------------------

  function guardarEmLocalStorage(chave, objeto) {
    const lista = JSON.parse(localStorage.getItem(chave)) || [];
    lista.push(objeto);
    localStorage.setItem(chave, JSON.stringify(lista));
  }

  function lerDeLocalStorage(chave) {
    return JSON.parse(localStorage.getItem(chave)) || [];
  }

  function limparLocalStorage(chave) {
    localStorage.removeItem(chave);
  }

  // -----------------------------------
  // Módulo: Denúncias (denuncia-form)
  // -----------------------------------

  const denunciaForm = document.querySelector("#denuncia-form");
  const denunciaTable = document.querySelector("#lista-denuncias");
  const denunciaMostrarBtn = document.querySelector("#mostrar");

  if (denunciaForm) {
    function getDenunciaFormData() {
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
      for (let i = 0; i < ficheiros.length; i++) {
        data.ficheiros.push(ficheiros[i].name);
      }

      return data;
    }

    denunciaForm.addEventListener("submit", e => {
      e.preventDefault();
      const data = getDenunciaFormData();
      guardarEmLocalStorage("denuncias", data);
      alert("Denúncia guardada com sucesso!");
      denunciaForm.reset();
    });

    if (denunciaMostrarBtn && denunciaTable) {
      denunciaMostrarBtn.addEventListener("click", () => {
        const denuncias = lerDeLocalStorage("denuncias");
        denunciaTable.innerHTML = denuncias.map(denuncia => `
          <tr>
            <td>${denuncia.nome}</td>
            <td>${denuncia.email}</td>
            <td>${denuncia.data}</td>
            <td>${denuncia.categoria}</td>
          </tr>
        `).join('');
      });
    }
  }

  // -----------------------------------
  // Módulo: Login (login-form)
  // -----------------------------------

  const loginForm = document.querySelector("#login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const data = {};
      const formElements = loginForm.elements;

      for (const element of formElements) {
        if (element.name) {
          data[element.name] = element.value;
        }
      }

      guardarEmLocalStorage("logins", data);
      alert("Login guardado com sucesso!");
      loginForm.reset();
    });
  }

  // Adiciona aqui outros módulos conforme necessário (ex: registos, mensagens, etc)

});
