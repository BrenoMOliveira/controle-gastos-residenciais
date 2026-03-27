using ControleGastos.Domain.Entities;

namespace ControleGastos.Application.Interfaces;

/// <summary>
/// Contrato de persistencia de categorias
/// </summary>
public interface ICategoriaRepository
{
    Task<List<Categoria>> ListarAsync();
    Task AdicionarAsync(Categoria categoria);
    Task SalvarAlteracoesAsync();
}
