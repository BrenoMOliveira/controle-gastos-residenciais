namespace ControleGastos.Application.DTOs.Relatorios;

public class RelatorioPessoaResponse
{
    public Guid PessoaId { get; set; }
    public string NomePessoa { get; set; } = string.Empty;
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal Saldo { get; set; }
}
