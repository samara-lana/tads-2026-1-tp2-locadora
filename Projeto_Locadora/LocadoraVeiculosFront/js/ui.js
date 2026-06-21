// Funções compartilhadas por todas as telas: navbar, notificações,
// confirmação de exclusão e formatadores.

const PAGINAS = [
  { href: "index.html", titulo: "Painel" },
  { href: "veiculos.html", titulo: "Veículos" },
  { href: "alugueis.html", titulo: "Aluguéis" },
  { href: "clientes.html", titulo: "Clientes" },
  { href: "carteira.html", titulo: "Carteira" },
  { href: "fabricantes.html", titulo: "Fabricantes" },
  { href: "categorias.html", titulo: "Categorias" },
];

function montarNavbar(paginaAtual) {
  const links = PAGINAS.map((p) => {
    const ativo = p.href === paginaAtual ? " active fw-semibold" : "";
    return `<li class="nav-item"><a class="nav-link${ativo}" href="${p.href}">${p.titulo}</a></li>`;
  }).join("");

  const html = `
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
    <div class="container">
      <a class="navbar-brand fw-bold" href="index.html">
        <span class="text-warning">&#128663;</span> Locadora de Veículos
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="menu">
        <ul class="navbar-nav ms-auto">${links}</ul>
      </div>
    </div>
  </nav>`;

  document.getElementById("navbar").innerHTML = html;
}

// Notificação flutuante (toast) no canto da tela.
function notificar(mensagem, tipo = "success") {
  let area = document.getElementById("toastArea");
  if (!area) {
    area = document.createElement("div");
    area.id = "toastArea";
    area.className = "toast-container position-fixed top-0 end-0 p-3";
    area.style.zIndex = "1100";
    document.body.appendChild(area);
  }

  const cor = tipo === "erro" ? "text-bg-danger" : "text-bg-success";
  const el = document.createElement("div");
  el.className = `toast align-items-center border-0 ${cor}`;
  el.role = "alert";
  el.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${mensagem}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;
  area.appendChild(el);
  const toast = new bootstrap.Toast(el, { delay: 3500 });
  toast.show();
  el.addEventListener("hidden.bs.toast", () => el.remove());
}

// Confirmação de exclusão usando modal do Bootstrap. Retorna uma Promise<boolean>.
function confirmar(mensagem) {
  return new Promise((resolve) => {
    let modalEl = document.getElementById("modalConfirma");
    if (!modalEl) {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = `
      <div class="modal fade" id="modalConfirma" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirmar ação</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" id="modalConfirmaTexto"></div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-danger" id="modalConfirmaOk">Excluir</button>
            </div>
          </div>
        </div>
      </div>`;
      document.body.appendChild(wrapper.firstElementChild);
      modalEl = document.getElementById("modalConfirma");
    }

    document.getElementById("modalConfirmaTexto").textContent = mensagem;
    const modal = new bootstrap.Modal(modalEl);
    const botaoOk = document.getElementById("modalConfirmaOk");

    const aoConfirmar = () => {
      modal.hide();
      resolve(true);
    };
    botaoOk.addEventListener("click", aoConfirmar, { once: true });
    modalEl.addEventListener(
      "hidden.bs.modal",
      () => {
        botaoOk.removeEventListener("click", aoConfirmar);
        resolve(false);
      },
      { once: true }
    );

    modal.show();
  });
}

function formatarMoeda(valor) {
  if (valor === null || valor === undefined) return "—";
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(valor) {
  if (!valor) return "—";
  const data = new Date(valor);
  if (isNaN(data)) return "—";
  return data.toLocaleDateString("pt-BR");
}

function formatarDataHora(valor) {
  if (!valor) return "—";
  const data = new Date(valor);
  if (isNaN(data)) return "—";
  return data.toLocaleString("pt-BR");
}

// Normaliza texto para busca (sem acento, minúsculo).
function normalizar(texto) {
  return (texto ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Exibe uma mensagem de tabela vazia / carregando dentro de um <tbody>.
function linhaMensagem(colspan, mensagem) {
  return `<tr><td colspan="${colspan}" class="text-center text-muted py-4">${mensagem}</td></tr>`;
}
