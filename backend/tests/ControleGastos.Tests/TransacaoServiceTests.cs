using ControleGastos.Application.DTOs.Transacoes;
using ControleGastos.Application.Exceptions;
using ControleGastos.Application.Interfaces;
using ControleGastos.Application.Services;
using ControleGastos.Application.Validators.Transacoes;
using ControleGastos.Domain.Entities;
using ControleGastos.Domain.Enums;
using FluentAssertions;
using Moq;

namespace ControleGastos.Tests;

public class TransacaoServiceTests
{
    private readonly Mock<ITransacaoRepository> _transacaoRepositoryMock = new();
    private readonly Mock<IPessoaRepository> _pessoaRepositoryMock = new();
    private readonly Mock<ICategoriaRepository> _categoriaRepositoryMock = new();

    [Fact]
    public async Task CriarAsync_DeveLancarExcecao_QuandoMenorDeIdadeInformarReceita()
    {
        var service = CriarService();
        var request = CriarRequest(tipo: (int)TipoTransacao.Receita);
        var pessoaId = request.PessoaId.GetValueOrDefault();
        var categoriaId = request.CategoriaId.GetValueOrDefault();

        _pessoaRepositoryMock
            .Setup(x => x.ObterPorIdAsync(pessoaId))
            .ReturnsAsync(new Pessoa { Id = pessoaId, Nome = "Ana", Idade = 17 });

        _categoriaRepositoryMock
            .Setup(x => x.ObterPorIdAsync(categoriaId))
            .ReturnsAsync(new Categoria
            {
                Id = categoriaId,
                Descricao = "Salário",
                Finalidade = FinalidadeCategoria.Receita
            });

        var act = async () => await service.CriarAsync(request);

        await act.Should()
            .ThrowAsync<BusinessRuleException>()
            .WithMessage("Para menores de idade, apenas transações do tipo despesa são permitidas.");
    }

    [Fact]
    public async Task CriarAsync_DeveLancarExcecao_QuandoCategoriaNaoForCompativel()
    {
        var service = CriarService();
        var request = CriarRequest(tipo: (int)TipoTransacao.Despesa);
        var pessoaId = request.PessoaId.GetValueOrDefault();
        var categoriaId = request.CategoriaId.GetValueOrDefault();

        _pessoaRepositoryMock
            .Setup(x => x.ObterPorIdAsync(pessoaId))
            .ReturnsAsync(new Pessoa { Id = pessoaId, Nome = "Carlos", Idade = 30 });

        _categoriaRepositoryMock
            .Setup(x => x.ObterPorIdAsync(categoriaId))
            .ReturnsAsync(new Categoria
            {
                Id = categoriaId,
                Descricao = "Salário",
                Finalidade = FinalidadeCategoria.Receita
            });

        var act = async () => await service.CriarAsync(request);

        await act.Should()
            .ThrowAsync<BusinessRuleException>()
            .WithMessage("A categoria selecionada não é compatível com o tipo da transação.");
    }

    [Fact]
    public async Task CriarAsync_DevePersistirTransacao_QuandoRequestForValido()
    {
        var service = CriarService();
        var request = CriarRequest(tipo: (int)TipoTransacao.Despesa, descricao: "  Mercado  ");
        var pessoaId = request.PessoaId.GetValueOrDefault();
        var categoriaId = request.CategoriaId.GetValueOrDefault();
        Transacao? transacaoAdicionada = null;

        _pessoaRepositoryMock
            .Setup(x => x.ObterPorIdAsync(pessoaId))
            .ReturnsAsync(new Pessoa { Id = pessoaId, Nome = "Marina", Idade = 24 });

        _categoriaRepositoryMock
            .Setup(x => x.ObterPorIdAsync(categoriaId))
            .ReturnsAsync(new Categoria
            {
                Id = categoriaId,
                Descricao = "Padaria",
                Finalidade = FinalidadeCategoria.Despesa
            });

        _transacaoRepositoryMock
            .Setup(x => x.AdicionarAsync(It.IsAny<Transacao>()))
            .Callback<Transacao>(transacao => transacaoAdicionada = transacao)
            .Returns(Task.CompletedTask);

        var response = await service.CriarAsync(request);

        response.Descricao.Should().Be("Mercado");
        response.Valor.Should().Be(request.Valor!.Value);
        response.Tipo.Should().Be((int)TipoTransacao.Despesa);
        response.PessoaId.Should().Be(pessoaId);
        response.CategoriaId.Should().Be(categoriaId);

        transacaoAdicionada.Should().NotBeNull();
        transacaoAdicionada!.Id.Should().NotBeEmpty();
        transacaoAdicionada.Descricao.Should().Be("Mercado");

        _transacaoRepositoryMock.Verify(x => x.AdicionarAsync(It.IsAny<Transacao>()), Times.Once);
        _transacaoRepositoryMock.Verify(x => x.SalvarAlteracoesAsync(), Times.Once);
    }

    private TransacaoService CriarService()
    {
        return new TransacaoService(
            _transacaoRepositoryMock.Object,
            _pessoaRepositoryMock.Object,
            _categoriaRepositoryMock.Object,
            new CriarTransacaoRequestValidator());
    }

    private static CriarTransacaoRequest CriarRequest(int tipo, string descricao = "Compra do mês")
    {
        return new CriarTransacaoRequest
        {
            Descricao = descricao,
            Valor = 150.75m,
            Tipo = tipo,
            PessoaId = Guid.NewGuid(),
            CategoriaId = Guid.NewGuid()
        };
    }
}
