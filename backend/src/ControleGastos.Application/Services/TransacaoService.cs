using ControleGastos.Application.DTOs.Transacoes;
using ControleGastos.Application.Exceptions;
using ControleGastos.Application.Interfaces;
using ControleGastos.Domain.Entities;
using ControleGastos.Domain.Enums;
using FluentValidation;

namespace ControleGastos.Application.Services;

/// <summary>
/// Serviço responsável pelos casos de uso de transações
/// Centraliza as lógicas de negócio e as validações cruzadas (Pessoa x Categoria x Transação) 
/// para garantir a consistência do domínio
/// </summary>
public class TransacaoService : ITransacaoService
{
    private readonly ITransacaoRepository _transacaoRepository;
    private readonly IPessoaRepository _pessoaRepository;
    private readonly ICategoriaRepository _categoriaRepository;
    private readonly IValidator<CriarTransacaoRequest> _criarValidator;

    public TransacaoService(
        ITransacaoRepository transacaoRepository,
        IPessoaRepository pessoaRepository,
        ICategoriaRepository categoriaRepository,
        IValidator<CriarTransacaoRequest> criarValidator)
    {
        _transacaoRepository = transacaoRepository;
        _pessoaRepository = pessoaRepository;
        _categoriaRepository = categoriaRepository;
        _criarValidator = criarValidator;
    }

    public async Task<List<TransacaoResponse>> ListarAsync()
    {
        var transacoes = await _transacaoRepository.ListarAsync();

        return transacoes
            .OrderBy(x => x.Descricao)
            .ThenBy(x => x.Valor)
            .Select(MapearParaResponse)
            .ToList();
    }

    public async Task<TransacaoResponse> CriarAsync(CriarTransacaoRequest request)
    {
        await _criarValidator.ValidateAndThrowAsync(request);

        var pessoaId = request.PessoaId ?? Guid.Empty;
        var categoriaId = request.CategoriaId ?? Guid.Empty;
        var tipo = (TipoTransacao)(request.Tipo ?? 0);
        var valor = request.Valor ?? 0m;

        var pessoa = await _pessoaRepository.ObterPorIdAsync(pessoaId);

        if (pessoa is null)
            throw new NotFoundException("Pessoa não encontrada.");

        var categoria = await _categoriaRepository.ObterPorIdAsync(categoriaId);

        if (categoria is null)
            throw new NotFoundException("Categoria não encontrada.");

        // REGRA DE NEGÓCIO: Menores de 18 anos são restritos apenas a registro de despesas
        if (pessoa.Idade < 18 && tipo == TipoTransacao.Receita)
            throw new BusinessRuleException("Para menores de idade, apenas transações do tipo despesa são permitidas.");

        // REGRA DE NEGÓCIO: A transação deve respeitar o escopo da categoria (receita, despesa ou ambas)
        if (!CategoriaCompativelComTipo(categoria.Finalidade, tipo))
            throw new BusinessRuleException("A categoria selecionada não é compatível com o tipo da transação.");

        var transacao = new Transacao
        {
            Id = Guid.NewGuid(),
            Descricao = request.Descricao.Trim(),
            Valor = valor,
            Tipo = tipo,
            PessoaId = pessoa.Id,
            CategoriaId = categoria.Id
        };

        await _transacaoRepository.AdicionarAsync(transacao);
        await _transacaoRepository.SalvarAlteracoesAsync();

        return MapearParaResponse(transacao);
    }

    private static bool CategoriaCompativelComTipo(FinalidadeCategoria finalidade, TipoTransacao tipo)
    {
        return finalidade == FinalidadeCategoria.Ambas ||
               (tipo == TipoTransacao.Despesa && finalidade == FinalidadeCategoria.Despesa) ||
               (tipo == TipoTransacao.Receita && finalidade == FinalidadeCategoria.Receita);
    }

    private static TransacaoResponse MapearParaResponse(Transacao transacao)
    {
        return new TransacaoResponse
        {
            Id = transacao.Id,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            Tipo = (int)transacao.Tipo,
            PessoaId = transacao.PessoaId,
            CategoriaId = transacao.CategoriaId
        };
    }
}