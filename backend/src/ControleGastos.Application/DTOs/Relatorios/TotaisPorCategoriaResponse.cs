namespace ControleGastos.Application.DTOs.Relatorios;

/// <summary>
/// Representa o retorno completo do relatório de totais por categoria
/// </summary>
public class TotaisPorCategoriaResponse
{
    /// <summary>
    /// Coleção de categorias com seus respectivos totais consolidados
    /// </summary>
    public List<RelatorioCategoriaResponse> Categorias { get; set; } = [];

    /// <summary>
    /// Totais gerais consolidados do relatório por categoria
    /// </summary>
    public TotaisGeraisResponse TotaisGerais { get; set; } = new();
}