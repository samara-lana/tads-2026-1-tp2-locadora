using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LocadoraVeiculosApi.Models
{
    public class Transacao
    {
        public int Id { get; set; }

        [Required]
        public int ClienteId { get; set; }
        public Cliente? Cliente { get; set; }

        [Required]
        public TipoTransacao Tipo { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        [Range(0.01, double.MaxValue)]
        public decimal Valor { get; set; }

        public DateTime DataHora { get; set; } = DateTime.Now;

        [StringLength(200)]
        public string? Descricao { get; set; }

        public int? AluguelId { get; set; }
        public Aluguel? Aluguel { get; set; }
    }
}
