namespace ControleGastos.Application.DTOs.Relatorios;

public class TotaisPorPessoaResponse
{
    public List<RelatorioPessoaResponse> Pessoas { get; set; } = [];
    public TotaisGeraisResponse TotaisGerais { get; set; } = new();
}
