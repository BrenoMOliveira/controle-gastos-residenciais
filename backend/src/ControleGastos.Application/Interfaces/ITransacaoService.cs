using ControleGastos.Application.DTOs.Transacoes;

namespace ControleGastos.Application.Interfaces;

/// <summary>
/// Contrato dos casos de uso de transações
/// </summary>
public interface ITransacaoService
{
    /// <summary>
    /// Retorna a lista de transações cadastradas para exibição na interface
    /// </summary>
    /// <returns>Coleção de transações prontas para exibição</returns>
    Task<List<TransacaoResponse>> ListarAsync();

    /// <summary>
    /// Cria uma nova transação a partir dos dados informados pelo usuário
    /// </summary>
    /// <param name="request">Dados necessários para cadastrar a transação</param>
    /// <returns>Transação criada e pronta para exibição</returns>
    Task<TransacaoResponse> CriarAsync(CriarTransacaoRequest request);
}