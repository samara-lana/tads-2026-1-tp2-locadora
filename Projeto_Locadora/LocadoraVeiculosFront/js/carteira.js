montarNavbar("carteira.html");

let clientes = [];

const TIPO = {
  1: { rotulo: "Recarga", classe: "text-success", sinal: "+" },
  2: { rotulo: "Pagamento", classe: "text-danger", sinal: "-" },
};

function tipoNumero(valor) {
  if (typeof valor === "number") return valor;
  const mapa = { Recarga: 1, Pagamento: 2 };
  return mapa[valor] ?? 0;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("selCliente").addEventListener("change", aoTrocarCliente);
  document.getElementById("formRecarga").addEventListener("submit", recarregar);
  carregar();
});

async function carregar() {
  try {
    clientes = await apiGet("/clientes");
    const sel = document.getElementById("selCliente");
    sel.innerHTML =
      '<option value="">Selecione um cliente...</option>' +
      clientes.map((c) => `<option value="${c.id}">${c.nome}</option>`).join("");

    // Permite chegar pela tela de clientes com ?cliente=ID já selecionado.
    const params = new URLSearchParams(window.location.search);
    const id = params.get("cliente");
    if (id && clientes.some((c) => c.id === Number(id))) {
      sel.value = id;
      aoTrocarCliente();
    }
  } catch (e) {
    notificar(e.message, "erro");
  }
}

function clienteSelecionado() {
  return document.getElementById("selCliente").value;
}

async function aoTrocarCliente() {
  const id = clienteSelecionado();
  const painel = document.getElementById("painel");
  if (!id) {
    painel.classList.add("d-none");
    return;
  }
  painel.classList.remove("d-none");
  await Promise.all([atualizarSaldo(id), atualizarExtrato(id)]);
}

async function atualizarSaldo(id) {
  try {
    const dados = await apiGet(`/clientes/${id}/saldo`);
    document.getElementById("saldoValor").textContent = formatarMoeda(dados.saldo);
    document.getElementById("saldoNome").textContent = dados.nome;
  } catch (e) {
    notificar(e.message, "erro");
  }
}

async function atualizarExtrato(id) {
  const tbody = document.getElementById("tabelaExtrato");
  try {
    const transacoes = await apiGet(`/clientes/${id}/extrato`);
    if (transacoes.length === 0) {
      tbody.innerHTML = linhaMensagem(4, "Nenhuma transação registrada.");
      return;
    }
    tbody.innerHTML = transacoes
      .map((t) => {
        const tipo = TIPO[tipoNumero(t.tipo)] || { rotulo: "—", classe: "", sinal: "" };
        return `
        <tr>
          <td>${formatarDataHora(t.dataHora)}</td>
          <td><span class="${tipo.classe} fw-semibold">${tipo.rotulo}</span></td>
          <td>${t.descricao ?? "—"}</td>
          <td class="text-end ${tipo.classe} fw-semibold">${tipo.sinal} ${formatarMoeda(t.valor)}</td>
        </tr>`;
      })
      .join("");
  } catch (e) {
    notificar(e.message, "erro");
  }
}

async function recarregar(evento) {
  evento.preventDefault();
  const id = clienteSelecionado();
  if (!id) return;
  const corpo = {
    valor: Number(document.getElementById("campoValor").value),
    descricao: document.getElementById("campoDescricao").value.trim() || null,
  };
  try {
    const r = await apiPost(`/clientes/${id}/recarga`, corpo);
    notificar(`Recarga realizada. Saldo: ${formatarMoeda(r.saldo)}`);
    document.getElementById("formRecarga").reset();
    await aoTrocarCliente();
  } catch (e) {
    notificar(e.message, "erro");
  }
}
