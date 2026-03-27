using ControleGastos.Application.Interfaces;
using ControleGastos.Domain.Entities;
using ControleGastos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Infrastructure.Repositories;

/// <summary>
/// Implementação concreta de persistência de pessoas utilizando Entity Framework Core
/// </summary>
public class PessoaRepository : IPessoaRepository
{
    private readonly AppDbContext _context;

    public PessoaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Pessoa>> ListarAsync()
    {
        // AsNoTracking melhora a performance de leitura/listagem quando não há necessidade de rastrear alterações
        return await _context.Pessoas
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Pessoa?> ObterPorIdAsync(Guid id)
    {
        return await _context.Pessoas
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task AdicionarAsync(Pessoa pessoa)
    {
        await _context.Pessoas.AddAsync(pessoa);
    }

    public Task AtualizarAsync(Pessoa pessoa)
    {
        _context.Pessoas.Update(pessoa);
        return Task.CompletedTask;
    }

    public Task RemoverAsync(Pessoa pessoa)
    {
        _context.Pessoas.Remove(pessoa);
        return Task.CompletedTask;
    }

    public async Task SalvarAlteracoesAsync()
    {
        await _context.SaveChangesAsync();
    }
}