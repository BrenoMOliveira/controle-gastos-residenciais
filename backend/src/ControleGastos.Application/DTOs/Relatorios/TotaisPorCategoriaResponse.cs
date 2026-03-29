namespace ControleGastos.Application.DTOs.Relatorios;

public class TotaisPorCategoriaResponse
{
    public List<RelatorioCategoriaResponse> Categorias { get; set; } = [];
    public TotaisGeraisResponse TotaisGerais { get; set; } = new();
}
