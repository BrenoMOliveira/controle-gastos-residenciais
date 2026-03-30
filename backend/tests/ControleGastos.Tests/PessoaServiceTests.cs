using ControleGastos.Application.DTOs.Pessoas;
using ControleGastos.Application.Exceptions;
using ControleGastos.Application.Interfaces;
using ControleGastos.Application.Services;
using ControleGastos.Application.Validators.Pessoas;
using ControleGastos.Domain.Entities;
using FluentAssertions;
using Moq;

namespace ControleGastos.Tests;

public class PessoaServiceTests
{
    private readonly Mock<IPessoaRepository> _pessoaRepositoryMock = new();

    [Fact]
    public async Task AtualizarAsync_DeveLancarExcecao_QuandoReduzirParaMenorDeIdadeEExistiremReceitas()
    {
        var service = CriarService();
        var pessoaId = Guid.NewGuid();
        var pessoa = new Pessoa
        {
            Id = pessoaId,
            Nome = "Marina",
            Idade = 24
        };

        _pessoaRepositoryMock
            .Setup(x => x.ObterPorIdAsync(pessoaId))
            .ReturnsAsync(pessoa);

        _pessoaRepositoryMock
            .Setup(x => x.PossuiReceitasAsync(pessoaId))
            .ReturnsAsync(true);

        var request = new AtualizarPessoaRequest
        {
            Nome = "Marina Souza",
            Idade = 17
        };

        var act = async () => await service.AtualizarAsync(pessoaId, request);

        await act.Should()
            .ThrowAsync<BusinessRuleException>()
            .WithMessage("Não é possível reduzir a idade para menor de 18 anos, pois existem transações de receita ativas para esta pessoa.");

        _pessoaRepositoryMock.Verify(x => x.AtualizarAsync(It.IsAny<Pessoa>()), Times.Never);
        _pessoaRepositoryMock.Verify(x => x.SalvarAlteracoesAsync(), Times.Never);
    }

    [Fact]
    public async Task AtualizarAsync_DevePermitirAtualizacao_QuandoNaoExistiremReceitas()
    {
        var service = CriarService();
        var pessoaId = Guid.NewGuid();
        var pessoa = new Pessoa
        {
            Id = pessoaId,
            Nome = "Carlos",
            Idade = 22
        };

        _pessoaRepositoryMock
            .Setup(x => x.ObterPorIdAsync(pessoaId))
            .ReturnsAsync(pessoa);

        _pessoaRepositoryMock
            .Setup(x => x.PossuiReceitasAsync(pessoaId))
            .ReturnsAsync(false);

        var request = new AtualizarPessoaRequest
        {
            Nome = "Carlos Silva",
            Idade = 17
        };

        var response = await service.AtualizarAsync(pessoaId, request);

        response.Nome.Should().Be("Carlos Silva");
        response.Idade.Should().Be(17);
        pessoa.Nome.Should().Be("Carlos Silva");
        pessoa.Idade.Should().Be(17);

        _pessoaRepositoryMock.Verify(x => x.AtualizarAsync(It.IsAny<Pessoa>()), Times.Once);
        _pessoaRepositoryMock.Verify(x => x.SalvarAlteracoesAsync(), Times.Once);
    }

    private PessoaService CriarService()
    {
        return new PessoaService(
            _pessoaRepositoryMock.Object,
            new CriarPessoaRequestValidator(),
            new AtualizarPessoaRequestValidator());
    }
}
