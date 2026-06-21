montarNavbar("veiculos.html");

let veiculos = [];
let fabricantes = [];
let categorias = [];
let modalForm;

document.addEventListener("DOMContentLoaded", () => {
  modalForm = new bootstrap.Modal(document.getElementById("modalForm"));

  document.getElementById("btnNovo").addEventListener("click", abrirNovo);
  document.getElementById("filtroTexto").addEventListener("input", render);
  document.getElementById("filtroFabricante").addEventListener("change", render);
  document.getElementById("filtroDisponivel").addEventListener("change", render);
  document.getElementById("formVeiculo").addEventListener("submit", salvar);

  carregar();
});

async function carregar() {
  try {
    [veiculos, fabricantes, categorias] = await Promise.all([
      apiGet("/veiculos"),
      apiGet("/fabricantes"),
      apiGet("/categoriasveiculo"),
    ]);
    preencherSelects();
    render();
  } catch (e) {
    notificar(e.message, "erro");
  }
}

function preencherSelects() {
  const filtroFab = document.getElementById("filtroFabricante");
  filtroFab.innerHTML =
    '<option value="">Todos</option>' +
    fabricantes.map((f) => `<option value="${f.nome}">${f.nome}</option>`).join("");

  document.getElementById("campoFabricante").innerHTML =
    '<option value="">Selecione...</option>' +
    fabricantes.map((f) => `<option value="${f.id}">${f.nome}</option>`).join("");

  document.getElementById("campoCategoria").innerHTML =
    '<option value="">Selecione...</option>' +
    categorias.map((c) => `<option value="${c.id}">${c.nome}</option>`).join("");
}

function render() {
  const texto = normalizar(document.getElementById("filtroTexto").value);
  const fab = document.getElementById("filtroFabricante").value;
  const disp = document.getElementById("filtroDisponivel").value;

  const lista = veiculos.filter((v) => {
    const baterTexto =
      normalizar(v.modelo).includes(texto) || normalizar(v.placa).includes(texto);
    const baterFab = !fab || v.fabricante === fab;
    const baterDisp =
      !disp || (disp === "sim" ? v.disponivel : !v.disponivel);
    return baterTexto && baterFab && baterDisp;
  });

  const tbody = document.getElementById("tabela");
  if (lista.length === 0) {
    tbody.innerHTML = linhaMensagem(9, "Nenhum veículo encontrado.");
    return;
  }

  tbody.innerHTML = lista
    .map((v) => {
      const badge = v.disponivel
        ? '<span class="badge badge-status-finalizado">Disponível</span>'
        : '<span class="badge badge-status-aberto">Alugado</span>';
      return `
      <tr>
        <td>${v.id}</td>
        <td>${v.modelo}</td>
        <td>${v.fabricante}</td>
        <td>${v.categoria}</td>
        <td>${v.anoFabricacao}</td>
        <td>${v.placa}</td>
        <td class="text-end">${formatarMoeda(v.valorDiariaBase)}</td>
        <td>${badge}</td>
        <td class="text-end tabela-acoes">
          <button class="btn btn-sm btn-outline-secondary" onclick="editar(${v.id})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="excluir(${v.id})">Excluir</button>
        </td>
      </tr>`;
    })
    .join("");
}

function abrirNovo() {
  document.getElementById("modalTitulo").textContent = "Novo veículo";
  document.getElementById("formVeiculo").reset();
  document.getElementById("campoId").value = "";
  document.getElementById("campoDisponivel").checked = true;
  modalForm.show();
}

function editar(id) {
  const v = veiculos.find((x) => x.id === id);
  if (!v) return;
  document.getElementById("modalTitulo").textContent = "Editar veículo";
  document.getElementById("campoId").value = v.id;
  document.getElementById("campoModelo").value = v.modelo;
  document.getElementById("campoAno").value = v.anoFabricacao;
  document.getElementById("campoPlaca").value = v.placa;
  document.getElementById("campoCor").value = v.cor ?? "";
  document.getElementById("campoKm").value = v.quilometragemAtual;
  document.getElementById("campoDiaria").value = v.valorDiariaBase;
  document.getElementById("campoDisponivel").checked = v.disponivel;

  // O endpoint retorna os nomes; resolvemos os ids pelo nome.
  const fab = fabricantes.find((f) => f.nome === v.fabricante);
  const cat = categorias.find((c) => c.nome === v.categoria);
  document.getElementById("campoFabricante").value = fab ? fab.id : "";
  document.getElementById("campoCategoria").value = cat ? cat.id : "";

  modalForm.show();
}

async function salvar(evento) {
  evento.preventDefault();
  const id = document.getElementById("campoId").value;
  const corpo = {
    modelo: document.getElementById("campoModelo").value.trim(),
    anoFabricacao: Number(document.getElementById("campoAno").value),
    placa: document.getElementById("campoPlaca").value.trim().toUpperCase(),
    cor: document.getElementById("campoCor").value.trim() || null,
    quilometragemAtual: Number(document.getElementById("campoKm").value || 0),
    valorDiariaBase: Number(document.getElementById("campoDiaria").value),
    disponivel: document.getElementById("campoDisponivel").checked,
    fabricanteId: Number(document.getElementById("campoFabricante").value),
    categoriaVeiculoId: Number(document.getElementById("campoCategoria").value),
  };

  try {
    if (id) {
      corpo.id = Number(id);
      await apiPut(`/veiculos/${id}`, corpo);
      notificar("Veículo atualizado.");
    } else {
      await apiPost("/veiculos", corpo);
      notificar("Veículo cadastrado.");
    }
    modalForm.hide();
    carregar();
  } catch (e) {
    notificar(e.message, "erro");
  }
}

async function excluir(id) {
  const v = veiculos.find((x) => x.id === id);
  const ok = await confirmar(`Excluir o veículo "${v?.modelo}" (${v?.placa})?`);
  if (!ok) return;
  try {
    await apiDelete(`/veiculos/${id}`);
    notificar("Veículo excluído.");
    carregar();
  } catch (e) {
    notificar(e.message, "erro");
  }
}
