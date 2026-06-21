# Locadora de Veículos — Trabalho Prático 2

Sistema web para uma locadora de veículos. O front-end foi construído nesta
etapa e está integrado à API desenvolvida no Trabalho Prático 1, que por sua vez
persiste os dados em um banco SQL Server.

## O problema

Uma locadora precisa controlar a frota, os clientes e os aluguéis. Sem um
sistema, esse controle é manual e propenso a erro: é difícil saber quais
veículos estão disponíveis, acompanhar os aluguéis em aberto e saber quanto cada
cliente movimentou. Este projeto centraliza esse controle em uma aplicação web
ligada a um banco de dados real, incluindo uma carteira por cliente para recarga
e pagamento dos aluguéis.

## Arquitetura

```
Front-end (HTML + Bootstrap + JavaScript)
        |  chamadas fetch (HTTP/JSON)
        v
API ASP.NET Core (Controllers)
        |  Entity Framework Core
        v
Banco de dados SQL Server
```

- **Back-end:** ASP.NET Core Web API (.NET 10) com Entity Framework Core e SQL
  Server. Reaproveitado do Trabalho 1, com duas adições nesta etapa: CORS (para
  o front poder consumir a API) e a carteira do cliente (saldo, recarga,
  pagamento e extrato).
- **Front-end:** HTML, Bootstrap 5 e JavaScript puro, consumindo a API via
  `fetch`. Sem etapa de build.

## Modelagem (entidades)

- **Fabricante:** nome e país de origem.
- **CategoriaVeiculo:** nome e descrição.
- **Veiculo:** modelo, ano, placa, cor, quilometragem, valor da diária,
  disponibilidade. Pertence a um fabricante e a uma categoria.
- **Cliente:** nome, CPF, e-mail, telefone, data de cadastro e **saldo** da
  carteira.
- **Aluguel:** liga um cliente a um veículo, com datas, quilometragem, valor da
  diária, valor total e situação (Aberto, Finalizado, Cancelado).
- **Transacao:** movimentações da carteira do cliente (Recarga ou Pagamento),
  com valor, data e vínculo opcional ao aluguel pago.

## Funcionalidades do front-end

Cada entidade tem tela com cadastro, edição, exclusão e busca com filtros em pelo
menos dois campos:

| Tela        | Filtros de busca                                  |
|-------------|---------------------------------------------------|
| Veículos    | modelo/placa, fabricante e disponibilidade        |
| Aluguéis    | cliente, situação e veículo                       |
| Clientes    | nome e CPF/e-mail                                  |
| Fabricantes | nome e país de origem                             |
| Categorias  | nome e descrição                                  |

Além disso:

- **Painel:** indicadores e três consultas vindas do banco (ver abaixo).
- **Carteira:** consulta de saldo, recarga e extrato de transações.
- **Aluguéis:** registro de devolução com cálculo do valor total e pagamento
  debitado da carteira do cliente.

## Exemplos de consultas (banco e rota)

As consultas abaixo são feitas no banco pela API e exibidas no front (no Painel):

1. **Veículos por fabricante**
   `GET /api/veiculos/filtros/veiculos-por-fabricante/{nome}`
   Lista os veículos de um fabricante escolhido.

2. **Clientes e número de aluguéis**
   `GET /api/clientes/filtros/clientes-com-alugueis`
   Agrupa os aluguéis por cliente e mostra a contagem.

3. **Aluguéis em aberto**
   `GET /api/alugueis/filtros/alugueis-em-aberto`
   Lista os aluguéis com situação Aberto.

Rotas da carteira (recarga, saldo e pagamento):

- `GET  /api/clientes/{id}/saldo` — consulta o saldo.
- `GET  /api/clientes/{id}/extrato` — lista as transações.
- `POST /api/clientes/{id}/recarga` — adiciona crédito ao saldo.
- `PUT  /api/alugueis/{id}/devolucao` — finaliza o aluguel e debita o pagamento.

## Wireframes

Wireframes de alta fidelidade das telas, feitos no Figma:

**https://www.figma.com/design/xNIYJ8W7bnmYKXvdAwl5oA/Locadora-de-Ve%C3%ADculos-%E2%80%94-Template--TADS-2026-1-TP2-?node-id=0-1**

## Como executar

Pré-requisitos: .NET 10 SDK e SQL Server (Express serve). A string de conexão
está em `Projeto_Locadora/LocadoraVeiculosApi/appsettings.json`.

1. **Back-end:**
   ```
   cd Projeto_Locadora/LocadoraVeiculosApi
   dotnet run
   ```
   Na primeira execução, o banco é criado e populado com dados fictícios
   automaticamente. A API sobe em `http://localhost:5084` (Swagger em
   `http://localhost:5084/swagger`).

2. **Front-end:** abra a pasta `Projeto_Locadora/LocadoraVeiculosFront` no
   VS Code e use a extensão Live Server no `index.html`, ou rode um servidor
   estático:
   ```
   cd Projeto_Locadora/LocadoraVeiculosFront
   python -m http.server 5500
   ```
   Acesse `http://localhost:5500`.

> Se a API rodar em outra porta, ajuste `API_BASE` em
> `LocadoraVeiculosFront/js/api.js`.

## Estrutura

```
Projeto_Locadora/
  LocadoraVeiculosApi/     back-end (API + EF + seed)
  LocadoraVeiculosFront/   front-end (HTML/Bootstrap/JS)
  docs/                    wireframes e roteiro do pitch
```
