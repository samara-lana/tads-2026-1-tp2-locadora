montarNavbar("categorias.html");

let categorias = [];
let modalForm;

document.addEventListener("DOMContentLoaded", () => {
  modalForm = new bootstrap.Modal(document.getElementById("modalForm"));

  document.getElementById("btnNovo").addEventListener("click", abrirNovo);
  document.getElementById("filtroNome").addEventListener("input", render);
  document.getElementById("filtroDescricao").addEventListener("input", render);
  document.getElementById("formCategoria").addEventListener("submit", salvar);

  carregar();
});

async function carregar() {
  try {
    categorias = await apiGet("/categoriasveiculo");
    render();
  } catch (e) {
    notificar(e.message, "erro");
  }
}

function render() {
  const nome = normalizar(document.getElementById("filtroNome").value);
  const descricao = normalizar(document.getElementById("filtroDescricao").value);

  const lista = categorias.filter(
    (c) =>
      normalizar(c.nome).includes(nome) &&
      normalizar(c.descricao).includes(descricao)
  );

  const tbody = document.getElementById("tabela");
  if (lista.length === 0) {
    tbody.innerHTML = linhaMensagem(4, "Nenhuma categoria encontrada.");
    return;
  }

  tbody.innerHTML = lista
    .map(
      (c) => `
      <tr>
        <td>${c.id}</td>
        <td>${c.nome}</td>
        <td>${c.descricao ?? "—"}</td>
        <td class="text-end tabela-acoes">
          <button class="btn btn-sm btn-outline-secondary" onclick="editar(${c.id})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="excluir(${c.id})">Excluir</button>
        </td>
      </tr>`
    )
    .join("");
}

function abrirNovo() {
  document.getElementById("modalTitulo").textContent = "Nova categoria";
  document.getElementById("campoId").value = "";
  document.getElementById("campoNome").value = "";
  document.getElementById("campoDescricao").value = "";
  modalForm.show();
}

function editar(id) {
  const c = categorias.find((x) => x.id === id);
  if (!c) return;
  document.getElementById("modalTitulo").textContent = "Editar categoria";
  document.getElementById("campoId").value = c.id;
  document.getElementById("campoNome").value = c.nome;
  document.getElementById("campoDescricao").value = c.descricao ?? "";
  modalForm.show();
}

async function salvar(evento) {
  evento.preventDefault();
  const id = document.getElementById("campoId").value;
  const corpo = {
    nome: document.getElementById("campoNome").value.trim(),
    descricao: document.getElementById("campoDescricao").value.trim() || null,
  };

  try {
    if (id) {
      corpo.id = Number(id);
      await apiPut(`/categoriasveiculo/${id}`, corpo);
      notificar("Categoria atualizada.");
    } else {
      await apiPost("/categoriasveiculo", corpo);
      notificar("Categoria cadastrada.");
    }
    modalForm.hide();
    carregar();
  } catch (e) {
    notificar(e.message, "erro");
  }
}

async function excluir(id) {
  const c = categorias.find((x) => x.id === id);
  const ok = await confirmar(`Excluir a categoria "${c?.nome}"?`);
  if (!ok) return;
  try {
    await apiDelete(`/categoriasveiculo/${id}`);
    notificar("Categoria excluída.");
    carregar();
  } catch (e) {
    notificar(e.message, "erro");
  }
}
