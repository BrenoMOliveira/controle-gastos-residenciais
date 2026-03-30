namespace ControleGastos.Application.DTOs.Transacoes;

/// <summary>
/// Representa os dados de uma transação retornada pela API
/// </summary>
public class TransacaoResponse
{
    public Guid Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }

    /// <summary>
    /// Tipo numérico da transação, indicando despesa ou receita
    /// </summary>
    public int Tipo { get; set; }

    /// <summary>
    /// Identificador da pessoa vinculada à transação
    /// </summary>
    public Guid PessoaId { get; set; }

    /// <summary>
    /// Identificador da categoria vinculada à transação
    /// </summary>
    public Guid CategoriaId { get; set; }
}