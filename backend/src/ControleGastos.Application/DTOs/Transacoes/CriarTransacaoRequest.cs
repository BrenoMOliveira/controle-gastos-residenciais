namespace ControleGastos.Application.DTOs.Transacoes;

/// <summary>
/// Representa os dados necessários para cadastrar uma transação
/// </summary>
public class CriarTransacaoRequest
{
    public string Descricao { get; set; } = string.Empty;
    public decimal? Valor { get; set; }

    /// <summary>
    /// Tipo numérico da transação, indicando despesa ou receita
    /// </summary>
    public int? Tipo { get; set; }

    /// <summary>
    /// Identificador da pessoa responsável pela transação
    /// </summary>
    public Guid? PessoaId { get; set; }

    /// <summary>
    /// Identificador da categoria utilizada na transação
    /// </summary>
    public Guid? CategoriaId { get; set; }
}