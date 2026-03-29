namespace ControleGastos.Application.DTOs.Relatorios;

public class RelatorioCategoriaResponse
{
    public Guid CategoriaId { get; set; }
    public string DescricaoCategoria { get; set; } = string.Empty;
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal Saldo { get; set; }
}
