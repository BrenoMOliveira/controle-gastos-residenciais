using ControleGastos.Domain.Entities;

namespace ControleGastos.Application.Interfaces;

/// <summary>
/// Contrato de persistência de pessoas
/// A camada de aplicação depende desta abstração para não conhecer detalhes de EF Core/SQLite
/// </summary>
public interface IPessoaRepository
{
    /// <summary>
    /// Lista todas as pessoas cadastradas para manutenção e relatórios
    /// </summary>
    /// <returns>Coleção de pessoas persistidas no sistema</returns>
    Task<List<Pessoa>> ListarAsync();

    /// <summary>
    /// Obtém uma pessoa específica pelo identificador
    /// </summary>
    /// <param name="id">Identificador único da pessoa</param>
    /// <returns>A pessoa encontrada ou <see langword="null" /> quando inexistente</returns>
    Task<Pessoa?> ObterPorIdAsync(Guid id);

    /// <summary>
    /// Verifica se a pessoa possui transações do tipo receita já cadastradas
    /// </summary>
    /// <param name="pessoaId">Identificador da pessoa analisada</param>
    /// <returns><see langword="true" /> quando existem receitas vinculadas; caso contrário, <see langword="false" /></returns>
    Task<bool> PossuiReceitasAsync(Guid pessoaId);

    /// <summary>
    /// Agenda a inclusão de uma nova pessoa no contexto de persistência
    /// </summary>
    /// <param name="pessoa">Pessoa a ser cadastrada</param>
    Task AdicionarAsync(Pessoa pessoa);

    /// <summary>
    /// Agenda a atualização dos dados de uma pessoa já existente
    /// </summary>
    /// <param name="pessoa">Pessoa com os dados atualizados</param>
    Task AtualizarAsync(Pessoa pessoa);

    /// <summary>
    /// Agenda a remoção de uma pessoa do contexto de persistência
    /// </summary>
    /// <param name="pessoa">Pessoa a ser excluída</param>
    Task RemoverAsync(Pessoa pessoa);

    /// <summary>
    /// Persiste no banco todas as alterações pendentes relacionadas a pessoas
    /// </summary>
    Task SalvarAlteracoesAsync();
}