// Cliente HTTP central do front-end. Concentra a URL base da API e o
// tratamento de erros, para que cada tela só precise chamar os helpers.
const API_BASE = "http://localhost:5084/api";

async function tratarResposta(resposta) {
  if (resposta.status === 204) return null;

  let dados = null;
  const texto = await resposta.text();
  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = texto;
    }
  }

  if (!resposta.ok) {
    const mensagem =
      (dados && (dados.mensagem || dados.title)) ||
      "Não foi possível concluir a operação.";
    throw new Error(mensagem);
  }

  return dados;
}

async function apiGet(caminho) {
  const resposta = await fetch(`${API_BASE}${caminho}`);
  return tratarResposta(resposta);
}

async function apiPost(caminho, corpo) {
  const resposta = await fetch(`${API_BASE}${caminho}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  });
  return tratarResposta(resposta);
}

async function apiPut(caminho, corpo) {
  const resposta = await fetch(`${API_BASE}${caminho}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  });
  return tratarResposta(resposta);
}

async function apiDelete(caminho) {
  const resposta = await fetch(`${API_BASE}${caminho}`, { method: "DELETE" });
  return tratarResposta(resposta);
}
