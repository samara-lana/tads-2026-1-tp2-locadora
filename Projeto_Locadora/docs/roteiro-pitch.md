# Roteiro do pitch (3 a 5 minutos)

Apresentação em vídeo com foco nas telas. Grave a tela navegando pelo sistema
enquanto fala. O tempo sugerido por bloco está entre parênteses.

## Antes de gravar

1. Suba o banco e a API: dentro de `LocadoraVeiculosApi`, rode `dotnet run`
   (na primeira execução o banco é criado e populado com os dados fictícios).
2. Abra o front: na pasta `LocadoraVeiculosFront`, use o Live Server (ou
   `python -m http.server`) e acesse o `index.html`.
3. Deixe as duas pontas rodando antes de começar a gravação.

## Bloco 1 — Problema (cerca de 40s)

Fale sobre o cenário: uma locadora precisa controlar a frota, os clientes e os
aluguéis. Hoje, sem um sistema, o controle é manual e sujeito a erro: saber
quais carros estão disponíveis, quanto cada cliente já gastou e quais aluguéis
ainda estão em aberto fica difícil. A proposta é um sistema web que centraliza
esse controle, ligado a um banco de dados real.

## Bloco 2 — Modelagem adotada (cerca de 50s)

Mostre rapidamente a estrutura. São cinco entidades principais:

- Fabricante e Categoria descrevem o veículo.
- Veículo pertence a um fabricante e a uma categoria.
- Cliente faz aluguéis e tem uma carteira (saldo).
- Aluguel liga um cliente a um veículo, com datas e valores.
- Transação registra as movimentações da carteira (recarga e pagamento).

Explique que o back-end é uma API em ASP.NET Core com Entity Framework e SQL
Server (reaproveitada do Trabalho 1), e o front é HTML, Bootstrap e JavaScript
consumindo essa API.

## Bloco 3 — Consultas (banco e rota) com resultado no front (cerca de 90s)

Mostre o Painel e destaque que cada bloco vem de uma consulta ao banco exposta
por uma rota da API.

Exemplo 1: "veículos por fabricante".
- Rota: `GET /api/veiculos/filtros/veiculos-por-fabricante/{nome}`.
- No painel, selecione um fabricante e mostre a tabela sendo preenchida.

Exemplo 2: "clientes e número de aluguéis".
- Rota: `GET /api/clientes/filtros/clientes-com-alugueis`.
- Mostre a tabela com a contagem por cliente.

Comente que a tela de Veículos também tem busca com filtros em mais de um campo
(modelo/placa, fabricante e disponibilidade), atendendo ao requisito de pesquisa.

## Bloco 4 — Carteira: recarga, saldo e pagamento (cerca de 60s)

Esta é a funcionalidade nova. Abra a Carteira:

1. Selecione um cliente e mostre o saldo atual (consulta de saldo).
2. Faça uma recarga informando um valor e veja o saldo e o extrato atualizarem.
3. Vá em Aluguéis, registre a devolução de um aluguel em aberto e mostre que o
   valor total é calculado pela API e debitado da carteira (pagamento). Volte na
   Carteira e mostre o pagamento aparecendo no extrato.

## Bloco 5 — Fechamento (cerca de 20s)

Reforce que o sistema cobre cadastro, edição, exclusão e pesquisa de todas as
entidades, integrado a um banco real, e que a carteira conecta o aluguel ao
pagamento. Agradeça.

## Lembretes

- Não exiba conteúdo de terceiros na gravação.
- A duração final deve ficar entre 3 e 5 minutos; pode editar para ajustar.
- Suba o vídeo na atividade do Canvas.
