montarNavbar("alugueis.html");

let alugueis = [];
let clientes = [];
let veiculos = [];
let modalForm;
let modalDevolucao;

const STATUS = {
  1: { rotulo: "Em aberto", classe: "badge-status-aberto" },
  2: { rotulo: "Finalizado", classe: "badge-status-finalizado" },
  3: { rotulo: "Cancelado", classe: "badge-status-cancelado" },
};

// O status pode chegar como número (1) ou texto ("Aberto"); normaliza para número.
function statusNumero(valor) {
  if (typeof valor === "number") return valor;
  const mapa = { Aberto: 1, Finalizado: 2, Cancelado: 3 };
  return mapa[valor] ?? 0;
}

document.addEventListener("DOMContentLoaded", () => {
  modalForm = new bootstrap.Modal(document.getElementById("modalForm"));
  modalDevolucao = new bootstrap.Modal(document.getElementById("modalDevolucao"));

  document.getElementById("btnNovo").addEventListener("click", abrirNovo);
  document.getElementById("filtroCliente").addEventListener("change", render);
  document.getElementById("filtroStatus").addEventListener("change", render);
  document.getElementById("filtroVeiculo").addEventListener("input", render);
  document.getElementById("formAluguel").addEventListener("submit", salvar);
  document.getElementById("formDevolucao").addEventListener("submit", confirmarDevolucao);

  carregar();
});

async function carregar() {
  try {
    [alugueis, clientes, veiculos] = await Promise.all([
      apiGet("/alugueis"),
      apiGet("/clientes"),
      apiGet("/veiculos"),
    ]);
    preencherFiltros();
    render();
  } catch (e) {
    notificar(e.message, "erro");
  }
}

function preencherFiltros() {
  document.getElementById("filtroCliente").innerHTML =
    '<option value="">Todos</option>' +
    clientes.map((c) => `<option value="${c.nome}">${c.nome}</option>`).join("");
}

function render() {
  const cliente = document.getElementById("filtroCliente").value;
  const status = document.getElementById("filtroStatus").value;
  const veiculo = normalizar(document.getElementById("filtroVeiculo").value);

  const lista = alugueis.filter((a) => {
    const baterCliente = !cliente || a.cliente === cliente;
    const baterStatus = !status || statusNumero(a.status) === Number(status);
    const baterVeiculo = normalizar(a.veiculo).includes(veiculo);
    return baterCliente && baterStatus && baterVeiculo;
  });

  const tbody = document.getElementById("tabela");
  if (lista.length === 0) {
    tbody.innerHTML = linhaMensagem(10, "Nenhum aluguel encontrado.");
    return;
  }

  tbody.innerHTML = lista
    .map((a) => {
      const s = STATUS[statusNumero(a.status)] || { rotulo: "—", classe: "" };
      const aberto = statusNumero(a.status) === 1;
      const botoes = aberto
        ? `<button class="btn btn-sm btn-success" onclick="abrirDevolucao(${a.id})">Devolver</button>
           <button class="btn btn-sm btn-outline-secondary" onclick="editar(${a.id})">Editar</button>
           <button class="btn btn-sm btn-outline-danger" onclick="excluir(${a.id})">Excluir</button>`
        : `<button class="btn btn-sm btn-outline-danger" onclick="excluir(${a.id})">Excluir</button>`;
      return `
      <tr>
        <td>${a.id}</td>
        <td>${a.cliente}</td>
        <td>${a.veiculo}</td>
        <td>${formatarData(a.dataInicio)}</td>
        <td>${formatarData(a.dataFimPrevista)}</td>
        <td>${formatarData(a.dataDevolucao)}</td>
        <td class="text-end">${formatarMoeda(a.valorDiaria)}</td>
        <td class="text-end">${formatarMoeda(a.valorTotal)}</td>
        <td><span class="badge ${s.classe}">${s.rotulo}</span></td>
        <td class="text-end tabela-acoes">${botoes}</td>
      </tr>`;
    })
    .join("");
}

function abrirNovo() {
  document.getElementById("modalTitulo").textContent = "Novo aluguel";
  document.getElementById("formAluguel").reset();
  document.getElementById("campoId").value = "";

  document.getElementById("campoCliente").innerHTML =
    '<option value="">Selecione...</option>' +
    clientes.map((c) => `<option value="${c.id}">${c.nome}</option>`).join("");

  const disponiveis = veiculos.filter((v) => v.disponivel);
  document.getElementById("campoVeiculo").innerHTML =
    '<option value="">Selecione...</option>' +
    disponiveis
      .map((v) => `<option value="${v.id}">${v.modelo} - ${v.placa} (${formatarMoeda(v.valorDiariaBase)}/dia)</option>`)
      .join("");

  modalForm.show();
}

function editar(id) {
  const a = alugueis.find((x) => x.id === id);
  if (!a) return;
  document.getElementById("modalTitulo").textContent = `Editar aluguel #${a.id}`;
  document.getElementById("campoId").value = a.id;

  document.getElementById("campoCliente").innerHTML = clientes
    .map((c) => `<option value="${c.id}">${c.nome}</option>`)
    .join("");
  const clienteAtual = clientes.find((c) => c.nome === a.cliente);
  if (clienteAtual) document.getElementById("campoCliente").value = clienteAtual.id;

  // No editar, mantém o veículo atual e oferece os disponíveis.
  const veiculoAtual = veiculos.find((v) => v.modelo === a.veiculo);
  const opcoes = veiculos.filter((v) => v.disponivel || v.id === veiculoAtual?.id);
  document.getElementById("campoVeiculo").innerHTML = opcoes
    .map((v) => `<option value="${v.id}">${v.modelo} - ${v.placa}</option>`)
    .join("");
  if (veiculoAtual) document.getElementById("campoVeiculo").value = veiculoAtual.id;

  document.getElementById("campoInicio").value = a.dataInicio?.substring(0, 10) ?? "";
  document.getElementById("campoFim").value = a.dataFimPrevista?.substring(0, 10) ?? "";

  modalForm.show();
}

async function salvar(evento) {
  evento.preventDefault();
  const id = document.getElementById("campoId").value;
  const corpo = {
    clienteId: Number(document.getElementById("campoCliente").value),
    veiculoId: Number(document.getElementById("campoVeiculo").value),
    dataInicio: document.getElementById("campoInicio").value,
    dataFimPrevista: document.getElementById("campoFim").value,
  };

  try {
    if (id) {
      corpo.id = Number(id);
      await apiPut(`/alugueis/${id}`, corpo);
      notificar("Aluguel atualizado.");
    } else {
      await apiPost("/alugueis", corpo);
      notificar("Aluguel registrado.");
    }
    modalForm.hide();
    carregar();
  } catch (e) {
    notificar(e.message, "erro");
  }
}

function abrirDevolucao(id) {
  const a = alugueis.find((x) => x.id === id);
  if (!a) return;
  document.getElementById("devId").value = a.id;
  document.getElementById("devResumo").textContent =
    `Aluguel #${a.id} - ${a.cliente} / ${a.veiculo} (diária ${formatarMoeda(a.valorDiaria)})`;
  document.getElementById("formDevolucao").reset();
  document.getElementById("devKm").min = a.quilometragemInicial ?? 0;
  modalDevolucao.show();
}

async function confirmarDevolucao(evento) {
  evento.preventDefault();
  const id = document.getElementById("devId").value;
  const corpo = {
    dataDevolucao: document.getElementById("devData").value,
    quilometragemFinal: Number(document.getElementById("devKm").value),
  };
  try {
    const r = await apiPut(`/alugueis/${id}/devolucao`, corpo);
    modalDevolucao.hide();
    notificar(
      `Devolução registrada. Valor: ${formatarMoeda(r.valorTotal)} | Saldo: ${formatarMoeda(r.saldoAtual)}`
    );
    carregar();
  } catch (e) {
    notificar(e.message, "erro");
  }
}

async function excluir(id) {
  const ok = await confirmar(`Excluir o aluguel #${id}?`);
  if (!ok) return;
  try {
    await apiDelete(`/alugueis/${id}`);
    notificar("Aluguel excluído.");
    carregar();
  } catch (e) {
    notificar(e.message, "erro");
  }
}
