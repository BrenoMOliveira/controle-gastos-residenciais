namespace ControleGastos.Application.DTOs.Pessoas;

/// <summary>
/// Representa os dados de uma pessoa retornada pela API
/// </summary>
public class PessoaResponse
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int Idade { get; set; }
}