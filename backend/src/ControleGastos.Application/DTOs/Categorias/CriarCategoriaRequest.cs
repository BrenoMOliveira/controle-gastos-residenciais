namespace ControleGastos.Application.DTOs.Categorias;

public class CriarCategoriaRequest
{
    public string Descricao { get; set; } = string.Empty;
    public int? Finalidade { get; set; }
}
