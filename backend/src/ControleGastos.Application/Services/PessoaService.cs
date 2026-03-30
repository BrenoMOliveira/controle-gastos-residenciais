using ControleGastos.Application.DTOs.Pessoas;
using ControleGastos.Application.Exceptions;
using ControleGastos.Application.Interfaces;
using ControleGastos.Domain.Entities;
using FluentValidation;

namespace ControleGastos.Application.Services;

/// <summary>
/// Serviço responsável pelos casos de uso de pessoas
/// A camada de aplicação executa as regras de negócio e delega a persistência ao repositório,
/// mantendo a infraestrutura desacoplada das decisões do domínio
/// </summary>
public class PessoaService : IPessoaService
{
    private readonly IPessoaRepository _pessoaRepository;
    private readonly IValidator<CriarPessoaRequest> _criarValidator;
    private readonly IValidator<AtualizarPessoaRequest> _atualizarValidator;

    public PessoaService(
        IPessoaRepository pessoaRepository,
        IValidator<CriarPessoaRequest> criarValidator,
        IValidator<AtualizarPessoaRequest> atualizarValidator)
    {
        _pessoaRepository = pessoaRepository;
        _criarValidator = criarValidator;
        _atualizarValidator = atualizarValidator;
    }

    public async Task<List<PessoaResponse>> ListarAsync()
    {
        var pessoas = await _pessoaRepository.ListarAsync();

        return pessoas
            .OrderBy(x => x.Nome)
            .Select(MapearParaResponse)
            .ToList();
    }

    public async Task<PessoaResponse> ObterPorIdAsync(Guid id)
    {
        var pessoa = await _pessoaRepository.ObterPorIdAsync(id);

        // A ausência da pessoa é tratada como erro de domínio da operação e não apenas como um valor nulo
        if (pessoa is null)
            throw new NotFoundException("Pessoa não encontrada.");

        return MapearParaResponse(pessoa);
    }

    public async Task<PessoaResponse> CriarAsync(CriarPessoaRequest request)
    {
        // A validação é executada na camada de aplicação para garantir consistência,
        // independentemente de quem consuma a API
        await _criarValidator.ValidateAndThrowAsync(request);

        // O Trim evita cadastros com espaços excedentes no início ou no fim do nome
        var pessoa = new Pessoa
        {
            Id = Guid.NewGuid(),
            Nome = request.Nome.Trim(),
            Idade = request.Idade!.Value
        };

        await _pessoaRepository.AdicionarAsync(pessoa);
        await _pessoaRepository.SalvarAlteracoesAsync();

        return MapearParaResponse(pessoa);
    }

    public async Task<PessoaResponse> AtualizarAsync(Guid id, AtualizarPessoaRequest request)
    {
        await _atualizarValidator.ValidateAndThrowAsync(request);

        var pessoa = await _pessoaRepository.ObterPorIdAsync(id);

        if (pessoa is null)
            throw new NotFoundException("Pessoa não encontrada.");

        var novaIdade = request.Idade!.Value;

        /*
         * Quando a pessoa já possui receitas registradas, impedir a redução da idade para menor de 18 anos
         * preserva a integridade histórica da base. Sem essa proteção, o cadastro ficaria incompatível com
         * a regra central do domínio, que não permite menores de idade com transações do tipo receita
         */
        if (novaIdade < 18)
        {
            var possuiReceitasAtivas = await _pessoaRepository.PossuiReceitasAsync(id);

            if (possuiReceitasAtivas)
                throw new BusinessRuleException("Não é possível reduzir a idade para menor de 18 anos, pois existem transações de receita ativas para esta pessoa.");
        }

        pessoa.Nome = request.Nome.Trim();
        pessoa.Idade = novaIdade;

        await _pessoaRepository.AtualizarAsync(pessoa);
        await _pessoaRepository.SalvarAlteracoesAsync();

        return MapearParaResponse(pessoa);
    }

    public async Task ExcluirAsync(Guid id)
    {
        var pessoa = await _pessoaRepository.ObterPorIdAsync(id);

        if (pessoa is null)
            throw new NotFoundException("Pessoa não encontrada.");

        // A exclusão da pessoa dispara a remoção das transações vinculadas via cascade delete,
        // conforme configurado no AppDbContext
        await _pessoaRepository.RemoverAsync(pessoa);
        await _pessoaRepository.SalvarAlteracoesAsync();
    }

    private static PessoaResponse MapearParaResponse(Pessoa pessoa)
    {
        return new PessoaResponse
        {
            Id = pessoa.Id,
            Nome = pessoa.Nome,
            Idade = pessoa.Idade
        };
    }
}