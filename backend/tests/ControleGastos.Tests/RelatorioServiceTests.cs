using ControleGastos.Application.Interfaces;
using ControleGastos.Application.Services;
using ControleGastos.Domain.Entities;
using ControleGastos.Domain.Enums;
using FluentAssertions;
using Moq;

namespace ControleGastos.Tests;

public class RelatorioServiceTests
{
    private readonly Mock<IPessoaRepository> _pessoaRepositoryMock = new();
    private readonly Mock<ICategoriaRepository> _categoriaRepositoryMock = new();
    private readonly Mock<ITransacaoRepository> _transacaoRepositoryMock = new();

    [Fact]
    public async Task ConsultarTotaisPorPessoaAsync_DeveRetornarTotaisPorPessoaETotalGeral()
    {
        var service = CriarService();

        var pessoaAna = new Pessoa { Id = Guid.NewGuid(), Nome = "Ana", Idade = 17 };
        var pessoaBruno = new Pessoa { Id = Guid.NewGuid(), Nome = "Bruno", Idade = 32 };
        var pessoaCarla = new Pessoa { Id = Guid.NewGuid(), Nome = "Carla", Idade = 28 };

        _pessoaRepositoryMock
            .Setup(x => x.ListarAsync())
            .ReturnsAsync([pessoaBruno, pessoaCarla, pessoaAna]);

        _transacaoRepositoryMock
            .Setup(x => x.ListarAsync())
            .ReturnsAsync(
            [
                new Transacao
                {
                    Id = Guid.NewGuid(),
                    PessoaId = pessoaAna.Id,
                    CategoriaId = Guid.NewGuid(),
                    Descricao = "Bolsa",
                    Tipo = TipoTransacao.Receita,
                    Valor = 300m
                },
                new Transacao
                {
                    Id = Guid.NewGuid(),
                    PessoaId = pessoaAna.Id,
                    CategoriaId = Guid.NewGuid(),
                    Descricao = "Livros",
                    Tipo = TipoTransacao.Despesa,
                    Valor = 120m
                },
                new Transacao
                {
                    Id = Guid.NewGuid(),
                    PessoaId = pessoaBruno.Id,
                    CategoriaId = Guid.NewGuid(),
                    Descricao = "Salário",
                    Tipo = TipoTransacao.Receita,
                    Valor = 4200m
                },
                new Transacao
                {
                    Id = Guid.NewGuid(),
                    PessoaId = pessoaBruno.Id,
                    CategoriaId = Guid.NewGuid(),
                    Descricao = "Aluguel",
                    Tipo = TipoTransacao.Despesa,
                    Valor = 1600m
                }
            ]);

        var response = await service.ConsultarTotaisPorPessoaAsync();

        response.Pessoas.Should().HaveCount(3);
        response.Pessoas.Select(item => item.NomePessoa).Should().ContainInOrder("Ana", "Bruno", "Carla");

        response.Pessoas[0].TotalReceitas.Should().Be(300m);
        response.Pessoas[0].TotalDespesas.Should().Be(120m);
        response.Pessoas[0].Saldo.Should().Be(180m);

        response.Pessoas[1].TotalReceitas.Should().Be(4200m);
        response.Pessoas[1].TotalDespesas.Should().Be(1600m);
        response.Pessoas[1].Saldo.Should().Be(2600m);

        response.Pessoas[2].TotalReceitas.Should().Be(0m);
        response.Pessoas[2].TotalDespesas.Should().Be(0m);
        response.Pessoas[2].Saldo.Should().Be(0m);

        response.TotaisGerais.TotalReceitas.Should().Be(4500m);
        response.TotaisGerais.TotalDespesas.Should().Be(1720m);
        response.TotaisGerais.SaldoLiquido.Should().Be(2780m);
    }

    [Fact]
    public async Task ConsultarTotaisPorPessoaAsync_DeveRetornarZeros_QuandoNaoHouverPessoas()
    {
        var service = CriarService();

        _pessoaRepositoryMock
            .Setup(x => x.ListarAsync())
            .ReturnsAsync([]);

        _transacaoRepositoryMock
            .Setup(x => x.ListarAsync())
            .ReturnsAsync([]);

        var response = await service.ConsultarTotaisPorPessoaAsync();

        response.Pessoas.Should().BeEmpty();
        response.TotaisGerais.TotalReceitas.Should().Be(0m);
        response.TotaisGerais.TotalDespesas.Should().Be(0m);
        response.TotaisGerais.SaldoLiquido.Should().Be(0m);
    }

    [Fact]
    public async Task ConsultarTotaisPorCategoriaAsync_DeveRetornarTotaisPorCategoriaETotalGeral()
    {
        var service = CriarService();

        var categoriaAluguel = new Categoria { Id = Guid.NewGuid(), Descricao = "Aluguel", Finalidade = FinalidadeCategoria.Despesa };
        var categoriaMercado = new Categoria { Id = Guid.NewGuid(), Descricao = "Mercado", Finalidade = FinalidadeCategoria.Despesa };
        var categoriaSalario = new Categoria { Id = Guid.NewGuid(), Descricao = "Salário", Finalidade = FinalidadeCategoria.Receita };

        _categoriaRepositoryMock
            .Setup(x => x.ListarAsync())
            .ReturnsAsync([categoriaSalario, categoriaMercado, categoriaAluguel]);

        _transacaoRepositoryMock
            .Setup(x => x.ListarAsync())
            .ReturnsAsync(
            [
                new Transacao
                {
                    Id = Guid.NewGuid(),
                    PessoaId = Guid.NewGuid(),
                    CategoriaId = categoriaSalario.Id,
                    Descricao = "Salário de março",
                    Tipo = TipoTransacao.Receita,
                    Valor = 5000m
                },
                new Transacao
                {
                    Id = Guid.NewGuid(),
                    PessoaId = Guid.NewGuid(),
                    CategoriaId = categoriaMercado.Id,
                    Descricao = "Supermercado",
                    Tipo = TipoTransacao.Despesa,
                    Valor = 800m
                },
                new Transacao
                {
                    Id = Guid.NewGuid(),
                    PessoaId = Guid.NewGuid(),
                    CategoriaId = categoriaMercado.Id,
                    Descricao = "Padaria",
                    Tipo = TipoTransacao.Despesa,
                    Valor = 150m
                }
            ]);

        var response = await service.ConsultarTotaisPorCategoriaAsync();

        response.Categorias.Should().HaveCount(3);
        response.Categorias.Select(item => item.DescricaoCategoria).Should().ContainInOrder("Aluguel", "Mercado", "Salário");

        response.Categorias[0].TotalReceitas.Should().Be(0m);
        response.Categorias[0].TotalDespesas.Should().Be(0m);
        response.Categorias[0].Saldo.Should().Be(0m);

        response.Categorias[1].TotalReceitas.Should().Be(0m);
        response.Categorias[1].TotalDespesas.Should().Be(950m);
        response.Categorias[1].Saldo.Should().Be(-950m);

        response.Categorias[2].TotalReceitas.Should().Be(5000m);
        response.Categorias[2].TotalDespesas.Should().Be(0m);
        response.Categorias[2].Saldo.Should().Be(5000m);

        response.TotaisGerais.TotalReceitas.Should().Be(5000m);
        response.TotaisGerais.TotalDespesas.Should().Be(950m);
        response.TotaisGerais.SaldoLiquido.Should().Be(4050m);
    }

    [Fact]
    public async Task ConsultarTotaisPorCategoriaAsync_DeveRetornarZeros_QuandoNaoHouverCategorias()
    {
        var service = CriarService();

        _categoriaRepositoryMock
            .Setup(x => x.ListarAsync())
            .ReturnsAsync([]);

        _transacaoRepositoryMock
            .Setup(x => x.ListarAsync())
            .ReturnsAsync([]);

        var response = await service.ConsultarTotaisPorCategoriaAsync();

        response.Categorias.Should().BeEmpty();
        response.TotaisGerais.TotalReceitas.Should().Be(0m);
        response.TotaisGerais.TotalDespesas.Should().Be(0m);
        response.TotaisGerais.SaldoLiquido.Should().Be(0m);
    }

    private RelatorioService CriarService()
    {
        return new RelatorioService(
            _pessoaRepositoryMock.Object,
            _categoriaRepositoryMock.Object,
            _transacaoRepositoryMock.Object);
    }
}
