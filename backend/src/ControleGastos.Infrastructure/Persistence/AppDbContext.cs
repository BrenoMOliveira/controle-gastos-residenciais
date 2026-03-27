using ControleGastos.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Pessoa> Pessoas => Set<Pessoa>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Transacao> Transacoes => Set<Transacao>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        modelBuilder.Entity<Pessoa>(entity =>
        {
            entity.ToTable("Pessoas");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Nome)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(x => x.Idade)
                .IsRequired();

            // Ao excluir uma pessoa, todas as transações vinculadas também devem ser removidas
            // Essa configuração atende diretamente a regra do teste técnico
            entity.HasMany(x => x.Transacoes)
                .WithOne(x => x.Pessoa)
                .HasForeignKey(x => x.PessoaId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.ToTable("Categorias");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Descricao)
                .IsRequired()
                .HasMaxLength(400);

            entity.Property(x => x.Finalidade)
                .IsRequired();
        });

        modelBuilder.Entity<Transacao>(entity =>
        {
            entity.ToTable("Transacoes");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Descricao)
                .IsRequired()
                .HasMaxLength(400);

            entity.Property(x => x.Valor)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            entity.Property(x => x.Tipo)
                .IsRequired();

            entity.HasOne(x => x.Pessoa)
                .WithMany(x => x.Transacoes)
                .HasForeignKey(x => x.PessoaId)
                .OnDelete(DeleteBehavior.Cascade);

            // Categoria não deve ser excluída automaticamente ao remover transações
            // O relacionamento foi configurado como Restrict para evitar exclusões em cascata acidentais
            entity.HasOne(x => x.Categoria)
                .WithMany(x => x.Transacoes)
                .HasForeignKey(x => x.CategoriaId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}