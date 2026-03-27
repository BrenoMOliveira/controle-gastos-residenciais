namespace ControleGastos.Application.DTOs.Pessoas;

public class CriarPessoaRequest
{
    public string Nome { get; set; } = string.Empty;
    public int? Idade { get; set; }
}