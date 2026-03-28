using ControleGastos.Domain.Entities;

namespace ControleGastos.Application.Interfaces;

/// <summary>
/// Contrato de persistência de categorias
/// </summary>
public interface ICategoriaRepository
{
    Task<List<Categoria>> ListarAsync();
    Task<Categoria?> ObterPorIdAsync(Guid id);
    Task AdicionarAsync(Categoria categoria);
    Task SalvarAlteracoesAsync();
}
