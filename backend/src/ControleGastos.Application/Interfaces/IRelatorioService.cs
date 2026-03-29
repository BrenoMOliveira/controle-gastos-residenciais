using ControleGastos.Application.DTOs.Relatorios;

namespace ControleGastos.Application.Interfaces;

/// <summary>
/// Contrato dos casos de uso de relatórios.
/// </summary>
public interface IRelatorioService
{
    Task<TotaisPorPessoaResponse> ConsultarTotaisPorPessoaAsync();
    Task<TotaisPorCategoriaResponse> ConsultarTotaisPorCategoriaAsync();
}
