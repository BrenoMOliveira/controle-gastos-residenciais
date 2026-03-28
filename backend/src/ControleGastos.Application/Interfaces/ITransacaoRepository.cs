using ControleGastos.Domain.Entities;

namespace ControleGastos.Application.Interfaces;

/// <summary>
/// Contrato de persistência de transações
/// </summary>
public interface ITransacaoRepository
{
    Task<List<Transacao>> ListarAsync();
    Task AdicionarAsync(Transacao transacao);
    Task SalvarAlteracoesAsync();
}
