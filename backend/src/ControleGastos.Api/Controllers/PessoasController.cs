using ControleGastos.Application.DTOs.Pessoas;
using ControleGastos.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

/// <summary>
/// Endpoint responsável pelo gerenciamento de pessoas:
/// criação, edição, exclusão e listagem
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly IPessoaService _pessoaService;

    public PessoasController(IPessoaService pessoaService)
    {
        _pessoaService = pessoaService;
    }

    [HttpGet]
    public async Task<ActionResult<List<PessoaResponse>>> Get()
    {
        var pessoas = await _pessoaService.ListarAsync();
        return Ok(pessoas);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PessoaResponse>> GetById(Guid id)
    {
        var pessoa = await _pessoaService.ObterPorIdAsync(id);
        return Ok(pessoa);
    }

    [HttpPost]
    public async Task<ActionResult<PessoaResponse>> Post([FromBody] CriarPessoaRequest request)
    {
        var pessoa = await _pessoaService.CriarAsync(request);
        // Retorna HTTP 201 created e já informa a rota (GetById) onde essa nova pessoa pode ser consultada
        return CreatedAtAction(nameof(GetById), new { id = pessoa.Id }, pessoa);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PessoaResponse>> Put(Guid id, [FromBody] AtualizarPessoaRequest request)
    {
        var pessoa = await _pessoaService.AtualizarAsync(id, request);
        return Ok(pessoa);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _pessoaService.ExcluirAsync(id);
        return NoContent();
    }
}