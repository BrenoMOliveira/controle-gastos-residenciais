using ControleGastos.Application.DTOs.Categorias;

namespace ControleGastos.Application.Interfaces;

/// <summary>
/// Contrato dos casos de uso de categorias
/// </summary>
public interface ICategoriaService
{
    Task<List<CategoriaResponse>> ListarAsync();
    Task<CategoriaResponse> CriarAsync(CriarCategoriaRequest request);
}
