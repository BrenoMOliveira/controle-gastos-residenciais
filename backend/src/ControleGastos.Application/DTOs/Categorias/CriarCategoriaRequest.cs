namespace ControleGastos.Application.DTOs.Categorias;

/// <summary>
/// Representa os dados necessários para cadastrar uma nova categoria
/// </summary>
public class CriarCategoriaRequest
{
    public string Descricao { get; set; } = string.Empty;
    public int? Finalidade { get; set; }
}