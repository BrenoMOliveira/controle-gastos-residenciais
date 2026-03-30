using ControleGastos.Domain.Entities;

namespace ControleGastos.Application.Interfaces;

/// <summary>
/// Contrato de persistência de transações
/// </summary>
public interface ITransacaoRepository
{
    /// <summary>
    /// Lista todas as transações cadastradas para uso em consultas e relatórios
    /// </summary>
    /// <returns>Coleção de transações persistidas no sistema</returns>
    Task<List<Transacao>> ListarAsync();

    /// <summary>
    /// Agenda a inclusão de uma nova transação no contexto de persistência
    /// </summary>
    /// <param name="transacao">Transação a ser cadastrada</param>
    Task AdicionarAsync(Transacao transacao);

    /// <summary>
    /// Persiste no banco todas as alterações pendentes relacionadas a transações
    /// </summary>
    Task SalvarAlteracoesAsync();
}