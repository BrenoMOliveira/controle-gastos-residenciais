namespace ControleGastos.Application.DTOs.Relatorios;

/// <summary>
/// Representa uma linha do relatório consolidado de totais por pessoa
/// </summary>
public class RelatorioPessoaResponse
{
    /// <summary>
    /// Identificador único da pessoa agregada no relatório
    /// </summary>
    public Guid PessoaId { get; set; }

    /// <summary>
    /// Nome da pessoa exibida no relatório
    /// </summary>
    public string NomePessoa { get; set; } = string.Empty;

    /// <summary>
    /// Soma de todas as transações de receita vinculadas à pessoa
    /// </summary>
    public decimal TotalReceitas { get; set; }

    /// <summary>
    /// Soma de todas as transações de despesa vinculadas à pessoa
    /// </summary>
    public decimal TotalDespesas { get; set; }

    /// <summary>
    /// Diferença entre receitas e despesas da pessoa
    /// </summary>
    public decimal Saldo { get; set; }
}