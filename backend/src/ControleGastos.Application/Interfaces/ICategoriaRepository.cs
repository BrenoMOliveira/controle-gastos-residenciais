using ControleGastos.Domain.Entities;

namespace ControleGastos.Application.Interfaces;

/// <summary>
/// Contrato de persistência de categorias
/// </summary>
public interface ICategoriaRepository
{
    /// <summary>
    /// Lista todas as categorias cadastradas para uso em cadastros e relatórios
    /// </summary>
    /// <returns>Coleção de categorias persistidas no sistema</returns>
    Task<List<Categoria>> ListarAsync();

    /// <summary>
    /// Obtém uma categoria específica pelo identificador
    /// </summary>
    /// <param name="id">Identificador único da categoria</param>
    /// <returns>A categoria encontrada ou <see langword="null" /> quando inexistente</returns>
    Task<Categoria?> ObterPorIdAsync(Guid id);

    /// <summary>
    /// Agenda a inclusão de uma nova categoria no contexto de persistência
    /// </summary>
    /// <param name="categoria">Categoria a ser cadastrada</param>
    Task AdicionarAsync(Categoria categoria);

    /// <summary>
    /// Persiste no banco todas as alterações pendentes relacionadas a categorias
    /// </summary>
    Task SalvarAlteracoesAsync();
}