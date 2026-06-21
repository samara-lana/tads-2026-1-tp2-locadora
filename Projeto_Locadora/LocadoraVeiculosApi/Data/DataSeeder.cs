using LocadoraVeiculosApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LocadoraVeiculosApi.Data
{
    /// <summary>
    /// Popula o banco com dados fictícios na primeira execução.
    /// Só insere se as tabelas estiverem vazias, evitando duplicar dados.
    /// </summary>
    public static class DataSeeder
    {
        public static void Seed(LocadoraContext context)
        {
            context.Database.Migrate();

            if (context.Fabricantes.Any())
                return;

            var fabricantes = new List<Fabricante>
            {
                new() { Nome = "Toyota", PaisOrigem = "Japão" },
                new() { Nome = "Volkswagen", PaisOrigem = "Alemanha" },
                new() { Nome = "Fiat", PaisOrigem = "Itália" },
                new() { Nome = "Chevrolet", PaisOrigem = "Estados Unidos" },
                new() { Nome = "Honda", PaisOrigem = "Japão" }
            };
            context.Fabricantes.AddRange(fabricantes);

            var categorias = new List<CategoriaVeiculo>
            {
                new() { Nome = "Hatch", Descricao = "Compactos de uso urbano" },
                new() { Nome = "Sedã", Descricao = "Porta-malas amplo e conforto" },
                new() { Nome = "SUV", Descricao = "Utilitários esportivos" },
                new() { Nome = "Picape", Descricao = "Veículos de carga leve" }
            };
            context.CategoriasVeiculo.AddRange(categorias);

            context.SaveChanges();

            var veiculos = new List<Veiculo>
            {
                new() { Modelo = "Corolla", AnoFabricacao = 2022, QuilometragemAtual = 32000, Placa = "ABC1D23", Cor = "Prata", ValorDiariaBase = 180.00m, Disponivel = true, FabricanteId = fabricantes[0].Id, CategoriaVeiculoId = categorias[1].Id },
                new() { Modelo = "Hilux", AnoFabricacao = 2021, QuilometragemAtual = 58000, Placa = "EFG2H34", Cor = "Branco", ValorDiariaBase = 320.00m, Disponivel = true, FabricanteId = fabricantes[0].Id, CategoriaVeiculoId = categorias[3].Id },
                new() { Modelo = "Polo", AnoFabricacao = 2023, QuilometragemAtual = 15000, Placa = "IJK3L45", Cor = "Vermelho", ValorDiariaBase = 140.00m, Disponivel = true, FabricanteId = fabricantes[1].Id, CategoriaVeiculoId = categorias[0].Id },
                new() { Modelo = "T-Cross", AnoFabricacao = 2022, QuilometragemAtual = 27000, Placa = "MNO4P56", Cor = "Cinza", ValorDiariaBase = 230.00m, Disponivel = true, FabricanteId = fabricantes[1].Id, CategoriaVeiculoId = categorias[2].Id },
                new() { Modelo = "Mobi", AnoFabricacao = 2020, QuilometragemAtual = 71000, Placa = "QRS5T67", Cor = "Branco", ValorDiariaBase = 110.00m, Disponivel = true, FabricanteId = fabricantes[2].Id, CategoriaVeiculoId = categorias[0].Id },
                new() { Modelo = "Toro", AnoFabricacao = 2023, QuilometragemAtual = 12000, Placa = "UVW6X78", Cor = "Azul", ValorDiariaBase = 280.00m, Disponivel = true, FabricanteId = fabricantes[2].Id, CategoriaVeiculoId = categorias[3].Id },
                new() { Modelo = "Onix", AnoFabricacao = 2021, QuilometragemAtual = 45000, Placa = "YZA7B89", Cor = "Preto", ValorDiariaBase = 130.00m, Disponivel = true, FabricanteId = fabricantes[3].Id, CategoriaVeiculoId = categorias[0].Id },
                new() { Modelo = "Tracker", AnoFabricacao = 2022, QuilometragemAtual = 33000, Placa = "CDE8F90", Cor = "Prata", ValorDiariaBase = 240.00m, Disponivel = true, FabricanteId = fabricantes[3].Id, CategoriaVeiculoId = categorias[2].Id },
                new() { Modelo = "Civic", AnoFabricacao = 2023, QuilometragemAtual = 9000, Placa = "GHI9J01", Cor = "Cinza", ValorDiariaBase = 210.00m, Disponivel = true, FabricanteId = fabricantes[4].Id, CategoriaVeiculoId = categorias[1].Id },
                new() { Modelo = "HR-V", AnoFabricacao = 2022, QuilometragemAtual = 22000, Placa = "KLM0N12", Cor = "Branco", ValorDiariaBase = 250.00m, Disponivel = true, FabricanteId = fabricantes[4].Id, CategoriaVeiculoId = categorias[2].Id }
            };
            context.Veiculos.AddRange(veiculos);

            var clientes = new List<Cliente>
            {
                new() { Nome = "Ana Souza", CPF = "11122233344", Email = "ana.souza@email.com", Telefone = "31988887777", DataCadastro = new DateTime(2026, 1, 10), Saldo = 110.00m },
                new() { Nome = "Bruno Lima", CPF = "22233344455", Email = "bruno.lima@email.com", Telefone = "31977776666", DataCadastro = new DateTime(2026, 2, 5), Saldo = 1200.00m },
                new() { Nome = "Carla Mendes", CPF = "33344455566", Email = "carla.mendes@email.com", Telefone = "31966665555", DataCadastro = new DateTime(2026, 2, 20), Saldo = 0.00m },
                new() { Nome = "Diego Rocha", CPF = "44455566677", Email = "diego.rocha@email.com", Telefone = "31955554444", DataCadastro = new DateTime(2026, 3, 12), Saldo = 350.00m },
                new() { Nome = "Eduarda Pinto", CPF = "55566677788", Email = "eduarda.pinto@email.com", Telefone = "31944443333", DataCadastro = new DateTime(2026, 4, 1), Saldo = 800.00m }
            };
            context.Clientes.AddRange(clientes);

            context.SaveChanges();

            // Recargas iniciais (extrato coerente com o saldo)
            context.Transacoes.AddRange(
                new Transacao { ClienteId = clientes[0].Id, Tipo = TipoTransacao.Recarga, Valor = 500.00m, DataHora = new DateTime(2026, 1, 10, 9, 0, 0), Descricao = "Recarga inicial" },
                new Transacao { ClienteId = clientes[1].Id, Tipo = TipoTransacao.Recarga, Valor = 1200.00m, DataHora = new DateTime(2026, 2, 5, 10, 30, 0), Descricao = "Recarga inicial" },
                new Transacao { ClienteId = clientes[3].Id, Tipo = TipoTransacao.Recarga, Valor = 350.00m, DataHora = new DateTime(2026, 3, 12, 14, 15, 0), Descricao = "Recarga inicial" },
                new Transacao { ClienteId = clientes[4].Id, Tipo = TipoTransacao.Recarga, Valor = 800.00m, DataHora = new DateTime(2026, 4, 1, 8, 45, 0), Descricao = "Recarga inicial" }
            );

            // Aluguel em aberto: Bruno alugou o Polo (deixa o veículo indisponível)
            veiculos[2].Disponivel = false;
            var aluguelAberto = new Aluguel
            {
                ClienteId = clientes[1].Id,
                VeiculoId = veiculos[2].Id,
                DataInicio = new DateTime(2026, 6, 15),
                DataFimPrevista = new DateTime(2026, 6, 22),
                QuilometragemInicial = veiculos[2].QuilometragemAtual,
                ValorDiaria = veiculos[2].ValorDiariaBase,
                Status = StatusAluguel.Aberto
            };

            // Aluguel finalizado: Ana alugou e devolveu o Onix, pagando pela carteira
            var aluguelFinalizado = new Aluguel
            {
                ClienteId = clientes[0].Id,
                VeiculoId = veiculos[6].Id,
                DataInicio = new DateTime(2026, 5, 2),
                DataFimPrevista = new DateTime(2026, 5, 5),
                DataDevolucao = new DateTime(2026, 5, 5),
                QuilometragemInicial = 44000,
                QuilometragemFinal = 44600,
                ValorDiaria = veiculos[6].ValorDiariaBase,
                ValorTotal = 3 * veiculos[6].ValorDiariaBase,
                Status = StatusAluguel.Finalizado
            };

            context.Alugueis.AddRange(aluguelAberto, aluguelFinalizado);
            context.SaveChanges();

            // Pagamento do aluguel finalizado debitado da carteira da Ana
            context.Transacoes.Add(new Transacao
            {
                ClienteId = clientes[0].Id,
                Tipo = TipoTransacao.Pagamento,
                Valor = aluguelFinalizado.ValorTotal!.Value,
                DataHora = new DateTime(2026, 5, 5, 17, 0, 0),
                Descricao = $"Pagamento do aluguel #{aluguelFinalizado.Id} (Onix)",
                AluguelId = aluguelFinalizado.Id
            });

            context.SaveChanges();
        }
    }
}
