using ControleGastos.Application.DTOs.Pessoas;

namespace ControleGastos.Application.Interfaces;

/// <summary>
/// Contrato dos casos de uso de pessoas
/// Esta camada expõe as operações necessárias para a API sem acoplar
/// os controllers à implementação concreta da lógica
/// </summary>
public interface IPessoaService
{
    /// <summary>
    /// Retorna a lista de pessoas cadastradas para exibição na interface
    /// </summary>
    /// <returns>Coleção de pessoas prontas para exibição</returns>
    Task<List<PessoaResponse>> ListarAsync();

    /// <summary>
    /// Obtém uma pessoa específica pelo identificador
    /// </summary>
    /// <param name="id">Identificador único da pessoa</param>
    /// <returns>Dados da pessoa encontrada</returns>
    Task<PessoaResponse> ObterPorIdAsync(Guid id);

    /// <summary>
    /// Cria uma nova pessoa a partir dos dados informados pelo usuário
    /// </summary>
    /// <param name="request">Dados necessários para cadastrar a pessoa</param>
    /// <returns>Pessoa criada e pronta para exibição</returns>
    Task<PessoaResponse> CriarAsync(CriarPessoaRequest request);

    /// <summary>
    /// Atualiza os dados de uma pessoa já cadastrada
    /// </summary>
    /// <param name="id">Identificador da pessoa a ser atualizada</param>
    /// <param name="request">Novos dados informados para a pessoa</param>
    /// <returns>Pessoa atualizada e pronta para exibição</returns>
    Task<PessoaResponse> AtualizarAsync(Guid id, AtualizarPessoaRequest request);

    /// <summary>
    /// Exclui uma pessoa e suas dependências conforme as regras de negócio
    /// </summary>
    /// <param name="id">Identificador da pessoa a ser removida</param>
    Task ExcluirAsync(Guid id);
}