namespace ControleGastos.Application.DTOs.Relatorios;

/// <summary>
/// Representa uma linha do relatório consolidado de totais por categoria
/// </summary>
public class RelatorioCategoriaResponse
{
    /// <summary>
    /// Identificador único da categoria agregada no relatório
    /// </summary>
    public Guid CategoriaId { get; set; }

    /// <summary>
    /// Descrição da categoria exibida no relatório
    /// </summary>
    public string DescricaoCategoria { get; set; } = string.Empty;

    /// <summary>
    /// Soma de todas as transações de receita vinculadas à categoria
    /// </summary>
    public decimal TotalReceitas { get; set; }

    /// <summary>
    /// Soma de todas as transações de despesa vinculadas à categoria
    /// </summary>
    public decimal TotalDespesas { get; set; }

    /// <summary>
    /// Diferença entre receitas e despesas da categoria
    /// </summary>
    public decimal Saldo { get; set; }
}