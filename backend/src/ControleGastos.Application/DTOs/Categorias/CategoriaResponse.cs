namespace ControleGastos.Application.DTOs.Categorias;

/// <summary>
/// Representa os dados de uma categoria retornada pela API
/// </summary>
public class CategoriaResponse
{
    public Guid Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public int Finalidade { get; set; }
}