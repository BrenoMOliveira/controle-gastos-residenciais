using ControleGastos.Application.DTOs.Categorias;

namespace ControleGastos.Application.Interfaces;

/// <summary>
/// Contrato dos casos de uso de categorias
/// </summary>
public interface ICategoriaService
{
    /// <summary>
    /// Retorna todas as categorias cadastradas ordenadas para exibição
    /// </summary>
    /// <returns>Coleção de categorias disponíveis no sistema</returns>
    Task<List<CategoriaResponse>> ListarAsync();

    /// <summary>
    /// Cria uma nova categoria a partir dos dados informados pelo usuário
    /// </summary>
    /// <param name="request">Dados necessários para cadastrar a categoria</param>
    /// <returns>Categoria criada e pronta para exibição na interface</returns>
    Task<CategoriaResponse> CriarAsync(CriarCategoriaRequest request);
}