montarNavbar("fabricantes.html");

let fabricantes = [];
let modalForm;

document.addEventListener("DOMContentLoaded", () => {
  modalForm = new bootstrap.Modal(document.getElementById("modalForm"));

  document.getElementById("btnNovo").addEventListener("click", abrirNovo);
  document.getElementById("filtroNome").addEventListener("input", render);
  document.getElementById("filtroPais").addEventListener("input", render);
  document.getElementById("formFabricante").addEventListener("submit", salvar);

  carregar();
});

async function carregar() {
  try {
    fabricantes = await apiGet("/fabricantes");
    render();
  } catch (e) {
    notificar(e.message, "erro");
  }
}

function render() {
  const nome = normalizar(document.getElementById("filtroNome").value);
  const pais = normalizar(document.getElementById("filtroPais").value);

  const lista = fabricantes.filter(
    (f) =>
      normalizar(f.nome).includes(nome) &&
      normalizar(f.paisOrigem).includes(pais)
  );

  const tbody = document.getElementById("tabela");
  if (lista.length === 0) {
    tbody.innerHTML = linhaMensagem(4, "Nenhum fabricante encontrado.");
    return;
  }

  tbody.innerHTML = lista
    .map(
      (f) => `
      <tr>
        <td>${f.id}</td>
        <td>${f.nome}</td>
        <td>${f.paisOrigem ?? "—"}</td>
        <td class="text-end tabela-acoes">
          <button class="btn btn-sm btn-outline-secondary" onclick="editar(${f.id})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="excluir(${f.id})">Excluir</button>
        </td>
      </tr>`
    )
    .join("");
}

function abrirNovo() {
  document.getElementById("modalTitulo").textContent = "Novo fabricante";
  document.getElementById("campoId").value = "";
  document.getElementById("campoNome").value = "";
  document.getElementById("campoPais").value = "";
  modalForm.show();
}

function editar(id) {
  const f = fabricantes.find((x) => x.id === id);
  if (!f) return;
  document.getElementById("modalTitulo").textContent = "Editar fabricante";
  document.getElementById("campoId").value = f.id;
  document.getElementById("campoNome").value = f.nome;
  document.getElementById("campoPais").value = f.paisOrigem ?? "";
  modalForm.show();
}

async function salvar(evento) {
  evento.preventDefault();
  const id = document.getElementById("campoId").value;
  const corpo = {
    nome: document.getElementById("campoNome").value.trim(),
    paisOrigem: document.getElementById("campoPais").value.trim() || null,
  };

  try {
    if (id) {
      corpo.id = Number(id);
      await apiPut(`/fabricantes/${id}`, corpo);
      notificar("Fabricante atualizado.");
    } else {
      await apiPost("/fabricantes", corpo);
      notificar("Fabricante cadastrado.");
    }
    modalForm.hide();
    carregar();
  } catch (e) {
    notificar(e.message, "erro");
  }
}

async function excluir(id) {
  const f = fabricantes.find((x) => x.id === id);
  const ok = await confirmar(`Excluir o fabricante "${f?.nome}"?`);
  if (!ok) return;
  try {
    await apiDelete(`/fabricantes/${id}`);
    notificar("Fabricante excluído.");
    carregar();
  } catch (e) {
    notificar(e.message, "erro");
  }
}
