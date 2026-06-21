montarNavbar("clientes.html");

let clientes = [];
let modalForm;

document.addEventListener("DOMContentLoaded", () => {
  modalForm = new bootstrap.Modal(document.getElementById("modalForm"));

  document.getElementById("btnNovo").addEventListener("click", abrirNovo);
  document.getElementById("filtroNome").addEventListener("input", render);
  document.getElementById("filtroDocumento").addEventListener("input", render);
  document.getElementById("formCliente").addEventListener("submit", salvar);

  carregar();
});

async function carregar() {
  try {
    clientes = await apiGet("/clientes");
    render();
  } catch (e) {
    notificar(e.message, "erro");
  }
}

function render() {
  const nome = normalizar(document.getElementById("filtroNome").value);
  const doc = normalizar(document.getElementById("filtroDocumento").value);

  const lista = clientes.filter((c) => {
    const baterNome = normalizar(c.nome).includes(nome);
    const baterDoc =
      normalizar(c.cpf).includes(doc) || normalizar(c.email).includes(doc);
    return baterNome && baterDoc;
  });

  const tbody = document.getElementById("tabela");
  if (lista.length === 0) {
    tbody.innerHTML = linhaMensagem(7, "Nenhum cliente encontrado.");
    return;
  }

  tbody.innerHTML = lista
    .map(
      (c) => `
      <tr>
        <td>${c.id}</td>
        <td>${c.nome}</td>
        <td>${c.cpf}</td>
        <td>${c.email}</td>
        <td>${c.telefone ?? "—"}</td>
        <td class="text-end fw-semibold">${formatarMoeda(c.saldo)}</td>
        <td class="text-end tabela-acoes">
          <a class="btn btn-sm btn-outline-success" href="carteira.html?cliente=${c.id}">Carteira</a>
          <button class="btn btn-sm btn-outline-secondary" onclick="editar(${c.id})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="excluir(${c.id})">Excluir</button>
        </td>
      </tr>`
    )
    .join("");
}

function abrirNovo() {
  document.getElementById("modalTitulo").textContent = "Novo cliente";
  document.getElementById("campoId").value = "";
  document.getElementById("campoNome").value = "";
  document.getElementById("campoCpf").value = "";
  document.getElementById("campoEmail").value = "";
  document.getElementById("campoTelefone").value = "";
  document.getElementById("campoCpf").disabled = false;
  modalForm.show();
}

function editar(id) {
  const c = clientes.find((x) => x.id === id);
  if (!c) return;
  document.getElementById("modalTitulo").textContent = "Editar cliente";
  document.getElementById("campoId").value = c.id;
  document.getElementById("campoNome").value = c.nome;
  document.getElementById("campoCpf").value = c.cpf;
  document.getElementById("campoEmail").value = c.email;
  document.getElementById("campoTelefone").value = c.telefone ?? "";
  modalForm.show();
}

async function salvar(evento) {
  evento.preventDefault();
  const id = document.getElementById("campoId").value;
  const existente = id ? clientes.find((x) => x.id === Number(id)) : null;

  const corpo = {
    nome: document.getElementById("campoNome").value.trim(),
    cpf: document.getElementById("campoCpf").value.trim(),
    email: document.getElementById("campoEmail").value.trim(),
    telefone: document.getElementById("campoTelefone").value.trim() || null,
  };

  try {
    if (id) {
      // Preserva campos não editáveis nesta tela (saldo e data de cadastro).
      corpo.id = Number(id);
      corpo.saldo = existente ? existente.saldo : 0;
      corpo.dataCadastro = existente ? existente.dataCadastro : undefined;
      await apiPut(`/clientes/${id}`, corpo);
      notificar("Cliente atualizado.");
    } else {
      await apiPost("/clientes", corpo);
      notificar("Cliente cadastrado.");
    }
    modalForm.hide();
    carregar();
  } catch (e) {
    notificar(e.message, "erro");
  }
}

async function excluir(id) {
  const c = clientes.find((x) => x.id === id);
  const ok = await confirmar(`Excluir o cliente "${c?.nome}"?`);
  if (!ok) return;
  try {
    await apiDelete(`/clientes/${id}`);
    notificar("Cliente excluído.");
    carregar();
  } catch (e) {
    notificar(e.message, "erro");
  }
}
