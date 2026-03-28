using ControleGastos.Application.DTOs.Categorias;
using ControleGastos.Application.Interfaces;
using ControleGastos.Domain.Entities;
using ControleGastos.Domain.Enums;
using FluentValidation;

namespace ControleGastos.Application.Services;

/// <summary>
/// Servico responsável pelos casos de uso de categorias
/// </summary>
public class CategoriaService : ICategoriaService
{
    private readonly ICategoriaRepository _categoriaRepository;
    private readonly IValidator<CriarCategoriaRequest> _criarValidator;

    public CategoriaService(
        ICategoriaRepository categoriaRepository,
        IValidator<CriarCategoriaRequest> criarValidator)
    {
        _categoriaRepository = categoriaRepository;
        _criarValidator = criarValidator;
    }

    public async Task<List<CategoriaResponse>> ListarAsync()
    {
        var categorias = await _categoriaRepository.ListarAsync();

        return categorias
            .OrderBy(x => x.Descricao)
            .Select(MapearParaResponse)
            .ToList();
    }

    public async Task<CategoriaResponse> CriarAsync(CriarCategoriaRequest request)
    {
        await _criarValidator.ValidateAndThrowAsync(request);

        var categoria = new Categoria
        {
            Id = Guid.NewGuid(),
            Descricao = request.Descricao.Trim(),
            Finalidade = (FinalidadeCategoria)request.Finalidade!.Value
        };

        await _categoriaRepository.AdicionarAsync(categoria);
        await _categoriaRepository.SalvarAlteracoesAsync();

        return MapearParaResponse(categoria);
    }

    private static CategoriaResponse MapearParaResponse(Categoria categoria)
    {
        return new CategoriaResponse
        {
            Id = categoria.Id,
            Descricao = categoria.Descricao,
            Finalidade = (int)categoria.Finalidade
        };
    }
}
