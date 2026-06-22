# Front-end — Locap (Locadora de Veículos · TP2)

Front-end em HTML, Bootstrap 5 e JavaScript puro, integrado à API
`LocadoraVeiculosApi` via `fetch`.

## Telas

- `index.html` — Painel com indicadores e consultas ao banco.
- `veiculos.html` — CRUD e busca de veículos.
- `alugueis.html` — CRUD, devolução e filtros de aluguéis.
- `clientes.html` — CRUD e busca de clientes.
- `carteira.html` — saldo, recarga e extrato (recarga, consulta de saldo e pagamento).
- `fabricantes.html` e `categorias.html` — CRUD e busca.

## Organização

```
css/styles.css      estilos próprios
js/api.js           cliente HTTP (URL base da API e tratamento de erro)
js/ui.js            navbar, notificações, confirmação e formatadores
js/<tela>.js        lógica de cada tela
```

## Como rodar

A API precisa estar no ar (porta `5084`). Sirva esta pasta com um servidor
estático:

```
python -m http.server 5500
```

ou use a extensão Live Server do VS Code no `index.html`.

A URL da API fica em `js/api.js` (`API_BASE`). Ajuste se a API rodar em outra porta.
