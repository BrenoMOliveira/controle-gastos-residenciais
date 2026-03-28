using ControleGastos.Application.DTOs.Relatorios;
using ControleGastos.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

/// <summary>
/// Endpoint responsável pelas consultas de relatórios.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class RelatoriosController : ControllerBase
{
    private readonly IRelatorioService _relatorioService;

    public RelatoriosController(IRelatorioService relatorioService)
    {
        _relatorioService = relatorioService;
    }

    [HttpGet("totais-por-pessoa")]
    public async Task<ActionResult<TotaisPorPessoaResponse>> GetTotaisPorPessoa()
    {
        var response = await _relatorioService.ConsultarTotaisPorPessoaAsync();
        return Ok(response);
    }
}
