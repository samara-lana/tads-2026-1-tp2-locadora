using System;
using System.ComponentModel.DataAnnotations;

namespace LocadoraVeiculosApi.DTOs
{
    /// <summary>
    /// Dados informados pelo usuário ao criar ou editar um aluguel.
    /// Os demais valores (diária, quilometragem, status, total) são definidos
    /// pela própria API a partir do veículo, e por isso não entram aqui.
    /// </summary>
    public class AluguelInputDto
    {
        [Required]
        public int ClienteId { get; set; }

        [Required]
        public int VeiculoId { get; set; }

        [Required]
        public DateTime DataInicio { get; set; }

        [Required]
        public DateTime DataFimPrevista { get; set; }
    }
}
