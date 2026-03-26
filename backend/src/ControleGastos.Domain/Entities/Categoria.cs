using ControleGastos.Domain.Enums;

namespace ControleGastos.Domain.Entities;

public class Categoria
{
    public Guid Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public FinalidadeCategoria Finalidade { get; set; }

    public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
}