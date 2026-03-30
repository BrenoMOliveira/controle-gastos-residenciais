namespace ControleGastos.Application.DTOs.Pessoas;

/// <summary>
/// Representa os dados recebidos para atualizar uma pessoa já cadastrada
/// </summary>
public class AtualizarPessoaRequest
{
    public string Nome { get; set; } = string.Empty;
    public int? Idade { get; set; }
}