namespace ControleGastos.Application.DTOs.Pessoas;

/// <summary>
/// Representa os dados necessários para cadastrar uma pessoa
/// </summary>
public class CriarPessoaRequest
{
    public string Nome { get; set; } = string.Empty;
    public int? Idade { get; set; }
}