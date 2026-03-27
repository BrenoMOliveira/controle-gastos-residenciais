using ControleGastos.Application.DTOs.Pessoas;

namespace ControleGastos.Application.Interfaces;

/// <summary>
/// Contrato dos casos de uso de pessoas
/// Esta camada expõe as operações necessárias para a API sem acoplar
/// os controllers à implementação concreta da lógica
/// </summary>
public interface IPessoaService
{
    Task<List<PessoaResponse>> ListarAsync();
    Task<PessoaResponse> ObterPorIdAsync(Guid id);
    Task<PessoaResponse> CriarAsync(CriarPessoaRequest request);
    Task<PessoaResponse> AtualizarAsync(Guid id, AtualizarPessoaRequest request);
    Task ExcluirAsync(Guid id);
}