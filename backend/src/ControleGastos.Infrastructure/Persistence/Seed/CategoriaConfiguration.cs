using ControleGastos.Domain.Entities;
using ControleGastos.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ControleGastos.Infrastructure.Persistence.Seed; 

public class CategoriaConfiguration : IEntityTypeConfiguration<Categoria>
{
    public void Configure(EntityTypeBuilder<Categoria> builder)
    {
        
        builder.HasData(
            new Categoria
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Descricao = "Salário",
                Finalidade = FinalidadeCategoria.Receita
            },
            new Categoria
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Descricao = "Supermercado",
                Finalidade = FinalidadeCategoria.Despesa
            },
            new Categoria
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Descricao = "Combustível",
                Finalidade = FinalidadeCategoria.Despesa
            },
            new Categoria
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Descricao = "Transferência / Pix",
                Finalidade = FinalidadeCategoria.Ambas
            }
        );
    }
}