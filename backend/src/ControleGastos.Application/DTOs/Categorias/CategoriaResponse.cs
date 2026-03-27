namespace ControleGastos.Application.DTOs.Categorias;

public class CategoriaResponse
{
    public Guid Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public int Finalidade { get; set; }
}
