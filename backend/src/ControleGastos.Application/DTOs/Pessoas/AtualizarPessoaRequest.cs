namespace ControleGastos.Application.DTOs.Pessoas;

public class AtualizarPessoaRequest
{
    public string Nome { get; set; } = string.Empty;
    public int? Idade { get; set; }
}