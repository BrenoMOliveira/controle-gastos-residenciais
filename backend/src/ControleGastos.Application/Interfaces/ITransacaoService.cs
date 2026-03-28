using ControleGastos.Application.DTOs.Transacoes;

namespace ControleGastos.Application.Interfaces;

/// <summary>
/// Contrato dos casos de uso de transações
/// </summary>
public interface ITransacaoService
{
    Task<List<TransacaoResponse>> ListarAsync();
    Task<TransacaoResponse> CriarAsync(CriarTransacaoRequest request);
}
