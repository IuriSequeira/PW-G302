const form = document.querySelector("#denuncia-form");
const tbody = document.querySelector("#lista-denuncias");

function getFormData() {
  const data = {};
  const formElements = form.elements;

  for (const element of formElements) {
    if (element.name && element.type !== "file") {
      data[element.name] = element.value;
    }
  }

  const ficheirosInput = document.getElementById("ficheiros");
  const ficheiros = ficheirosInput.files;
  data.ficheiros = [];
  for (let i = 0; i < ficheiros.length; i++) {
    data.ficheiros.push(ficheiros[i].name);
  }

  return data;
}

function guardarLocal(data) {
  const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];
  denuncias.push(data);
  localStorage.setItem("denuncias", JSON.stringify(denuncias));
}

function mostrarDenuncias() {
  const denuncias = JSON.parse(localStorage.getItem("denuncias")) || [];
  tbody.innerHTML = denuncias.map(denuncia => `
    <tr>
      <td>${denuncia.nome}</td>
      <td>${denuncia.email}</td>
      <td>${denuncia.data}</td>
      <td>${denuncia.categoria}</td>
    </tr>
  `).join('');
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const data = getFormData();
  guardarLocal(data);
  alert("Denúncia guardada com sucesso!");
  form.reset();
});

document.getElementById("mostrar").addEventListener("click", mostrarDenuncias);
