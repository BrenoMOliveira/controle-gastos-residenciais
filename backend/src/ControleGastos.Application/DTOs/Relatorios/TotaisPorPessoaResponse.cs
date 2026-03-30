namespace ControleGastos.Application.DTOs.Relatorios;

/// <summary>
/// Representa o retorno completo do relatório de totais por pessoa
/// </summary>
public class TotaisPorPessoaResponse
{
    /// <summary>
    /// Coleção de pessoas com seus respectivos totais consolidados
    /// </summary>
    public List<RelatorioPessoaResponse> Pessoas { get; set; } = [];

    /// <summary>
    /// Totais gerais consolidados do relatório por pessoa
    /// </summary>
    public TotaisGeraisResponse TotaisGerais { get; set; } = new();
}