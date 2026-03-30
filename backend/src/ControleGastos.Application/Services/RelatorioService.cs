using ControleGastos.Application.DTOs.Relatorios;
using ControleGastos.Application.Interfaces;
using ControleGastos.Domain.Enums;

namespace ControleGastos.Application.Services;

/// <summary>
/// Serviço responsável pelos casos de uso de relatórios
/// </summary>
public class RelatorioService : IRelatorioService
{
    private readonly IPessoaRepository _pessoaRepository;
    private readonly ICategoriaRepository _categoriaRepository;
    private readonly ITransacaoRepository _transacaoRepository;

    public RelatorioService(
        IPessoaRepository pessoaRepository,
        ICategoriaRepository categoriaRepository,
        ITransacaoRepository transacaoRepository)
    {
        _pessoaRepository = pessoaRepository;
        _categoriaRepository = categoriaRepository;
        _transacaoRepository = transacaoRepository;
    }

    public async Task<TotaisPorPessoaResponse> ConsultarTotaisPorPessoaAsync()
    {
        var pessoas = await _pessoaRepository.ListarAsync();
        var transacoes = await _transacaoRepository.ListarAsync();

        // O agrupamento em memória por PessoaId evita múltiplas buscas repetidas por pessoa
        // e deixa os cálculos de receita e despesa centralizados em uma única estrutura
        var totaisPorPessoaId = transacoes
            .GroupBy(transacao => transacao.PessoaId)
            .ToDictionary(
                grupo => grupo.Key,
                grupo => new
                {
                    TotalReceitas = grupo
                        .Where(transacao => transacao.Tipo == TipoTransacao.Receita)
                        .Sum(transacao => transacao.Valor),
                    TotalDespesas = grupo
                        .Where(transacao => transacao.Tipo == TipoTransacao.Despesa)
                        .Sum(transacao => transacao.Valor)
                });

        // O dicionário permite consultar os totais já agregados com acesso rápido,
        // inclusive tratando pessoas sem transações com valores zerados de forma explícita
        var pessoasResponse = pessoas
            .OrderBy(pessoa => pessoa.Nome)
            .Select(pessoa =>
            {
                var totaisPessoa = totaisPorPessoaId.GetValueOrDefault(
                    pessoa.Id,
                    new
                    {
                        TotalReceitas = 0m,
                        TotalDespesas = 0m
                    });

                return new RelatorioPessoaResponse
                {
                    PessoaId = pessoa.Id,
                    NomePessoa = pessoa.Nome,
                    TotalReceitas = totaisPessoa.TotalReceitas,
                    TotalDespesas = totaisPessoa.TotalDespesas,
                    Saldo = totaisPessoa.TotalReceitas - totaisPessoa.TotalDespesas
                };
            })
            .ToList();

        return new TotaisPorPessoaResponse
        {
            Pessoas = pessoasResponse,
            TotaisGerais = CriarTotaisGerais(
                pessoasResponse.Sum(item => item.TotalReceitas),
                pessoasResponse.Sum(item => item.TotalDespesas))
        };
    }

    public async Task<TotaisPorCategoriaResponse> ConsultarTotaisPorCategoriaAsync()
    {
        var categorias = await _categoriaRepository.ListarAsync();
        var transacoes = await _transacaoRepository.ListarAsync();

        // O agrupamento em memória por CategoriaId segue a mesma estratégia do relatório por pessoa,
        // consolidando os cálculos em uma única passagem para simplificar a leitura e o desempenho
        var totaisPorCategoriaId = transacoes
            .GroupBy(transacao => transacao.CategoriaId)
            .ToDictionary(
                grupo => grupo.Key,
                grupo => new
                {
                    TotalReceitas = grupo
                        .Where(transacao => transacao.Tipo == TipoTransacao.Receita)
                        .Sum(transacao => transacao.Valor),
                    TotalDespesas = grupo
                        .Where(transacao => transacao.Tipo == TipoTransacao.Despesa)
                        .Sum(transacao => transacao.Valor)
                });

        // O uso do dicionário evita recalcular totais por categoria durante a projeção final
        // e garante o retorno de categorias sem movimentação com totais zerados
        var categoriasResponse = categorias
            .OrderBy(categoria => categoria.Descricao)
            .Select(categoria =>
            {
                var totaisCategoria = totaisPorCategoriaId.GetValueOrDefault(
                    categoria.Id,
                    new
                    {
                        TotalReceitas = 0m,
                        TotalDespesas = 0m
                    });

                return new RelatorioCategoriaResponse
                {
                    CategoriaId = categoria.Id,
                    DescricaoCategoria = categoria.Descricao,
                    TotalReceitas = totaisCategoria.TotalReceitas,
                    TotalDespesas = totaisCategoria.TotalDespesas,
                    Saldo = totaisCategoria.TotalReceitas - totaisCategoria.TotalDespesas
                };
            })
            .ToList();

        return new TotaisPorCategoriaResponse
        {
            Categorias = categoriasResponse,
            TotaisGerais = CriarTotaisGerais(
                categoriasResponse.Sum(item => item.TotalReceitas),
                categoriasResponse.Sum(item => item.TotalDespesas))
        };
    }

    private static TotaisGeraisResponse CriarTotaisGerais(decimal totalReceitas, decimal totalDespesas)
    {
        return new TotaisGeraisResponse
        {
            TotalReceitas = totalReceitas,
            TotalDespesas = totalDespesas,
            SaldoLiquido = totalReceitas - totalDespesas
        };
    }
}