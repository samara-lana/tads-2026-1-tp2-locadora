using System.ComponentModel.DataAnnotations;

namespace LocadoraVeiculosApi.DTOs
{
    public class RecargaDto
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor da recarga deve ser maior que zero.")]
        public decimal Valor { get; set; }

        [StringLength(200)]
        public string? Descricao { get; set; }
    }
}
