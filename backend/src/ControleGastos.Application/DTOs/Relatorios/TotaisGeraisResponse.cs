namespace ControleGastos.Application.DTOs.Relatorios;

/// <summary>
/// Representa os totais gerais consolidados de um relatório
/// </summary>
public class TotaisGeraisResponse
{
    /// <summary>
    /// Soma total das receitas do relatório
    /// </summary>
    public decimal TotalReceitas { get; set; }

    /// <summary>
    /// Soma total das despesas do relatório
    /// </summary>
    public decimal TotalDespesas { get; set; }

    /// <summary>
    /// Saldo líquido consolidado, calculado por receitas menos despesas
    /// </summary>
    public decimal SaldoLiquido { get; set; }
}