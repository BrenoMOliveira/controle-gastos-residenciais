using ControleGastos.Application.DTOs.Transacoes;
using ControleGastos.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

/// <summary>
/// Endpoint responsável pelo gerenciamento de transações:
/// criação e listagem
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly ITransacaoService _transacaoService;

    public TransacoesController(ITransacaoService transacaoService)
    {
        _transacaoService = transacaoService;
    }

    [HttpGet]
    public async Task<ActionResult<List<TransacaoResponse>>> Get()
    {
        var transacoes = await _transacaoService.ListarAsync();
        return Ok(transacoes);
    }

    [HttpPost]
    public async Task<ActionResult<TransacaoResponse>> Post([FromBody] CriarTransacaoRequest request)
    {
        var transacao = await _transacaoService.CriarAsync(request);
        return CreatedAtAction(nameof(Get), transacao);
    }
}