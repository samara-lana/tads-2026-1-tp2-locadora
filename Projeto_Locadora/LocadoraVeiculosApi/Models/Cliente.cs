using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LocadoraVeiculosApi.Models
{
    public class Cliente
    {
        public int Id { get; set; }

        [Required]
        [StringLength(120)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [StringLength(11, MinimumLength = 11)]
        public string CPF { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(120)]
        public string Email { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Telefone { get; set; }

        public DateTime DataCadastro { get; set; } = DateTime.Now;

        [Column(TypeName = "decimal(10,2)")]
        [Range(0, double.MaxValue)]
        public decimal Saldo { get; set; } = 0;

        public ICollection<Aluguel> Alugueis { get; set; } = new List<Aluguel>();

        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}
