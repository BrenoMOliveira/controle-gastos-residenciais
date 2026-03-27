using ControleGastos.Domain.Entities;

namespace ControleGastos.Application.Interfaces;

/// <summary>
/// Contrato de persistência de pessoas
/// A camada de aplicação depende desta abstração para não conhecer detalhes de EF Core/SQLite
/// </summary>
public interface IPessoaRepository
{
    Task<List<Pessoa>> ListarAsync();
    Task<Pessoa?> ObterPorIdAsync(Guid id);
    Task AdicionarAsync(Pessoa pessoa);
    Task AtualizarAsync(Pessoa pessoa);
    Task RemoverAsync(Pessoa pessoa);
    Task SalvarAlteracoesAsync();
}