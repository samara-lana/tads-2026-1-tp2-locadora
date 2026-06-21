using LocadoraVeiculosApi.Data;
using LocadoraVeiculosApi.DTOs;
using LocadoraVeiculosApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocadoraVeiculosApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly LocadoraContext _context;

        public ClientesController(LocadoraContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetAll()
        {
            return Ok(await _context.Clientes.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetById(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
                return NotFound(new { mensagem = "Cliente não encontrado." });

            return Ok(cliente);
        }

        [HttpPost]
        public async Task<ActionResult<Cliente>> Create(Cliente cliente)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool cpfExiste = await _context.Clientes.AnyAsync(c => c.CPF == cliente.CPF);
            if (cpfExiste)
                return BadRequest(new { mensagem = "CPF já cadastrado." });

            bool emailExiste = await _context.Clientes.AnyAsync(c => c.Email == cliente.Email);
            if (emailExiste)
                return BadRequest(new { mensagem = "E-mail já cadastrado." });

            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = cliente.Id }, cliente);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Cliente cliente)
        {
            if (id != cliente.Id)
                return BadRequest(new { mensagem = "ID inválido." });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existente = await _context.Clientes.FindAsync(id);

            if (existente == null)
                return NotFound(new { mensagem = "Cliente não encontrado." });

            bool cpfExiste = await _context.Clientes
                .AnyAsync(c => c.CPF == cliente.CPF && c.Id != id);

            if (cpfExiste)
                return BadRequest(new { mensagem = "CPF já cadastrado para outro cliente." });

            bool emailExiste = await _context.Clientes
                .AnyAsync(c => c.Email == cliente.Email && c.Id != id);

            if (emailExiste)
                return BadRequest(new { mensagem = "E-mail já cadastrado para outro cliente." });

            existente.Nome = cliente.Nome;
            existente.CPF = cliente.CPF;
            existente.Email = cliente.Email;
            existente.Telefone = cliente.Telefone;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
                return NotFound(new { mensagem = "Cliente não encontrado." });

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("filtros/clientes-com-alugueis")]
        public async Task<ActionResult> GetClientesComAlugueis()
        {
            var resultado = await _context.Clientes
                .GroupJoin(
                    _context.Alugueis,
                    cliente => cliente.Id,
                    aluguel => aluguel.ClienteId,
                    (cliente, alugueis) => new
                    {
                        Cliente = cliente.Nome,
                        cliente.Email,
                        QuantidadeAlugueis = alugueis.Count()
                    })
                .ToListAsync();

            return Ok(resultado);
        }

        // ----- Carteira do cliente (recarga, saldo e pagamento) -----

        [HttpGet("{id}/saldo")]
        public async Task<ActionResult> GetSaldo(int id)
        {
            var cliente = await _context.Clientes
                .Where(c => c.Id == id)
                .Select(c => new { c.Id, c.Nome, c.Saldo })
                .FirstOrDefaultAsync();

            if (cliente == null)
                return NotFound(new { mensagem = "Cliente não encontrado." });

            return Ok(cliente);
        }

        [HttpGet("{id}/extrato")]
        public async Task<ActionResult> GetExtrato(int id)
        {
            bool clienteExiste = await _context.Clientes.AnyAsync(c => c.Id == id);
            if (!clienteExiste)
                return NotFound(new { mensagem = "Cliente não encontrado." });

            var transacoes = await _context.Transacoes
                .Where(t => t.ClienteId == id)
                .OrderByDescending(t => t.DataHora)
                .Select(t => new
                {
                    t.Id,
                    t.Tipo,
                    t.Valor,
                    t.DataHora,
                    t.Descricao,
                    t.AluguelId
                })
                .ToListAsync();

            return Ok(transacoes);
        }

        [HttpPost("{id}/recarga")]
        public async Task<ActionResult> Recarregar(int id, [FromBody] RecargaDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
                return NotFound(new { mensagem = "Cliente não encontrado." });

            cliente.Saldo += dto.Valor;

            _context.Transacoes.Add(new Transacao
            {
                ClienteId = cliente.Id,
                Tipo = TipoTransacao.Recarga,
                Valor = dto.Valor,
                DataHora = DateTime.Now,
                Descricao = string.IsNullOrWhiteSpace(dto.Descricao) ? "Recarga de saldo" : dto.Descricao
            });

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensagem = "Recarga realizada com sucesso.",
                cliente.Id,
                cliente.Nome,
                cliente.Saldo
            });
        }
    }
}