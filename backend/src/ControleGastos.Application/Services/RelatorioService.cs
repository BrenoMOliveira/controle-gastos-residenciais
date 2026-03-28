using ControleGastos.Application.DTOs.Relatorios;
using ControleGastos.Application.Interfaces;
using ControleGastos.Domain.Enums;

namespace ControleGastos.Application.Services;

/// <summary>
/// Serviço responsável pelos casos de uso de relatórios.
/// </summary>
public class RelatorioService : IRelatorioService
{
    private readonly IPessoaRepository _pessoaRepository;
    private readonly ITransacaoRepository _transacaoRepository;

    public RelatorioService(
        IPessoaRepository pessoaRepository,
        ITransacaoRepository transacaoRepository)
    {
        _pessoaRepository = pessoaRepository;
        _transacaoRepository = transacaoRepository;
    }

    public async Task<TotaisPorPessoaResponse> ConsultarTotaisPorPessoaAsync()
    {
        var pessoas = await _pessoaRepository.ListarAsync();
        var transacoes = await _transacaoRepository.ListarAsync();

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
            TotaisGerais = new TotaisGeraisResponse
            {
                TotalReceitas = pessoasResponse.Sum(item => item.TotalReceitas),
                TotalDespesas = pessoasResponse.Sum(item => item.TotalDespesas),
                SaldoLiquido = pessoasResponse.Sum(item => item.Saldo)
            }
        };
    }
}
