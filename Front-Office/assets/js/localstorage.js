// Correção segura para guardar qualquer array no localStorage
function guardarEmLocalStorage(chave, objeto) {
  const listaAtual = JSON.parse(localStorage.getItem(chave)) || [];
  const lista = Array.isArray(listaAtual) ? listaAtual : [];
  lista.push(objeto);
  localStorage.setItem(chave, JSON.stringify(lista));
}

// Função para mostrar alertas (usada em todas as ações)
function mostrarMensagem(titulo, mensagem, tipo) {
  localStorage.setItem("mensagemModal", JSON.stringify({ titulo, mensagem, tipo }));
}

// =========================
// FORMULÁRIO DE DENÚNCIA
// =========================
const denunciaForm = document.querySelector("#denuncia-form");

function atualizarEstadoFormulario() {
  const contador = document.getElementById("contador-denuncias");
  const botaoSubmeter = document.querySelector("#denuncia-form button[type='submit']");
  const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];
  const emAnalise = Array.isArray(denuncias) ? denuncias.filter(d => d.estado === "analisar") : [];
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

if (denunciaForm) {
  atualizarEstadoFormulario();

  denunciaForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];
    const emAnalise = denuncias.filter(d => d.estado === "analisar");

    if (emAnalise.length >= 15) {
      mostrarMensagem("Limite Atingido", "Neste momento não é possível submeter a sua denúncia.", "bg-warning");
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
      data.perito = "";
      data.materiais = "";
      data.grau = "";

      guardarEmLocalStorage("denuncias", data);
      mostrarMensagem("Sucesso", "Denúncia guardada com sucesso!", "bg-success");

      denunciaForm.reset();
      atualizarEstadoFormulario();
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
}

// =========================
// REGISTO DE UTILIZADOR
// =========================
const signupForm = document.querySelector("#signup-form");

if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = signupForm.elements["nome"].value;
    const email = signupForm.elements["email"].value;
    const password = signupForm.elements["password"].value;

    const logins = JSON.parse(localStorage.getItem("logins")) || [];
    if (logins.some(u => u.email === email)) {
      mostrarMensagem("Erro", "Este email já está registado.", "bg-danger");
      location.reload();
      return;
    }

    const novoUtilizador = {
      id: logins.length > 0 ? logins[logins.length - 1].id + 1 : 1,
      nome,
      email,
      password,
      website: "",
      morada: "",
      foto: ""
    };
    

    logins.push(novoUtilizador);
    localStorage.setItem("logins", JSON.stringify(logins));

    mostrarMensagem("Conta criada", "Conta criada com sucesso! Pode agora iniciar sessão.", "bg-success");
    window.location.href = "login.html";
  });
}

// =========================
// LOGIN DE UTILIZADOR
// =========================
const loginForm = document.querySelector("#login-form");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = loginForm.elements["email"].value;
    const password = loginForm.elements["password"].value;

    const logins = JSON.parse(localStorage.getItem("logins")) || [];
    const valido = logins.find(u => u.email === email && u.password === password);

    if (valido) {
      localStorage.setItem("utilizadorAtivo", JSON.stringify(valido)); // << AQUI
      mostrarMensagem("Bem-vindo", "Login efetuado com sucesso!", "bg-success");
      window.location.href = "index.html";
    } else {
      mostrarMensagem("Erro de autenticação", "Email ou password inválidos.", "bg-danger");
      location.reload();
    }
  });
}

