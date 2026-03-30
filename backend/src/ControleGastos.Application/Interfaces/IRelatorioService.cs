using ControleGastos.Application.DTOs.Relatorios;

namespace ControleGastos.Application.Interfaces;

/// <summary>
/// Contrato dos casos de uso de relatórios
/// </summary>
public interface IRelatorioService
{
    /// <summary>
    /// Consolida receitas, despesas e saldo para todas as pessoas cadastradas
    /// </summary>
    /// <returns>Estrutura completa do relatório de totais por pessoa</returns>
    Task<TotaisPorPessoaResponse> ConsultarTotaisPorPessoaAsync();

    /// <summary>
    /// Consolida receitas, despesas e saldo para todas as categorias cadastradas
    /// </summary>
    /// <returns>Estrutura completa do relatório de totais por categoria</returns>
    Task<TotaisPorCategoriaResponse> ConsultarTotaisPorCategoriaAsync();
}