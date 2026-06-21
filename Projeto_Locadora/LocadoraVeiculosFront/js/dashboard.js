montarNavbar("index.html");

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("selFabricante").addEventListener("change", consultarPorFabricante);
  carregar();
});

async function carregar() {
  try {
    const [veiculos, clientes, abertos, fabricantes, clientesAlugueis] =
      await Promise.all([
        apiGet("/veiculos"),
        apiGet("/clientes"),
        apiGet("/alugueis/filtros/alugueis-em-aberto"),
        apiGet("/fabricantes"),
        apiGet("/clientes/filtros/clientes-com-alugueis"),
      ]);

    // Indicadores
    document.getElementById("statVeiculos").textContent = veiculos.length;
    document.getElementById("statDisponiveis").textContent = veiculos.filter(
      (v) => v.disponivel
    ).length;
    document.getElementById("statAbertos").textContent = abertos.length;
    document.getElementById("statClientes").textContent = clientes.length;

    // Select de fabricantes
    document.getElementById("selFabricante").innerHTML =
      '<option value="">Selecione um fabricante...</option>' +
      fabricantes.map((f) => `<option value="${f.nome}">${f.nome}</option>`).join("");

    renderAbertos(abertos);
    renderClientes(clientesAlugueis);
  } catch (e) {
    notificar(e.message, "erro");
  }
}

function renderAbertos(lista) {
  const tbody = document.getElementById("tabelaAbertos");
  if (lista.length === 0) {
    tbody.innerHTML = linhaMensagem(7, "Nenhum aluguel em aberto.");
    return;
  }
  tbody.innerHTML = lista
    .map(
      (a) => `
      <tr>
        <td>${a.id}</td>
        <td>${a.cliente}</td>
        <td>${a.veiculo}</td>
        <td>${a.fabricante}</td>
        <td>${formatarData(a.dataInicio)}</td>
        <td>${formatarData(a.dataFimPrevista)}</td>
        <td class="text-end">${formatarMoeda(a.valorDiaria)}</td>
      </tr>`
    )
    .join("");
}

function renderClientes(lista) {
  const tbody = document.getElementById("tabelaClientes");
  if (lista.length === 0) {
    tbody.innerHTML = linhaMensagem(3, "Nenhum cliente cadastrado.");
    return;
  }
  tbody.innerHTML = lista
    .map(
      (c) => `
      <tr>
        <td>${c.cliente}</td>
        <td>${c.email}</td>
        <td class="text-end">${c.quantidadeAlugueis}</td>
      </tr>`
    )
    .join("");
}

async function consultarPorFabricante() {
  const nome = document.getElementById("selFabricante").value;
  const tbody = document.getElementById("tabelaPorFabricante");
  if (!nome) {
    tbody.innerHTML =
      '<tr><td colspan="3" class="text-center text-muted py-3">Escolha um fabricante.</td></tr>';
    return;
  }
  try {
    const lista = await apiGet(
      `/veiculos/filtros/veiculos-por-fabricante/${encodeURIComponent(nome)}`
    );
    if (lista.length === 0) {
      tbody.innerHTML = linhaMensagem(3, "Nenhum veículo para este fabricante.");
      return;
    }
    tbody.innerHTML = lista
      .map(
        (v) => `
        <tr>
          <td>${v.modelo}</td>
          <td>${v.placa}</td>
          <td>${v.anoFabricacao}</td>
        </tr>`
      )
      .join("");
  } catch (e) {
    notificar(e.message, "erro");
  }
}
