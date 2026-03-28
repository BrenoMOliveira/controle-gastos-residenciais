using ControleGastos.Application.DTOs.Categorias;
using ControleGastos.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

/// <summary>
/// Endpoint responsável pelo gerenciamento de categorias:
/// criação e listagem
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly ICategoriaService _categoriaService;

    public CategoriasController(ICategoriaService categoriaService)
    {
        _categoriaService = categoriaService;
    }

    [HttpGet]
    public async Task<ActionResult<List<CategoriaResponse>>> Get()
    {
        var categorias = await _categoriaService.ListarAsync();
        return Ok(categorias);
    }

    [HttpPost]
    public async Task<ActionResult<CategoriaResponse>> Post([FromBody] CriarCategoriaRequest request)
    {
        var categoria = await _categoriaService.CriarAsync(request);
        return CreatedAtAction(nameof(Get), categoria);
    }
}
