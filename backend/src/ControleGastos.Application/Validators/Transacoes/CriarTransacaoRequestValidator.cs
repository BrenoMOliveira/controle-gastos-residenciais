using ControleGastos.Application.DTOs.Transacoes;
using ControleGastos.Domain.Enums;
using FluentValidation;

namespace ControleGastos.Application.Validators.Transacoes;

public class CriarTransacaoRequestValidator : AbstractValidator<CriarTransacaoRequest>
{
    public CriarTransacaoRequestValidator()
    {
        RuleFor(x => x.Descricao)
            .NotEmpty().WithMessage("A descrição é obrigatória.")
            .MaximumLength(400).WithMessage("A descrição deve ter no máximo 400 caracteres.");

        RuleFor(x => x.Valor)
            .NotNull().WithMessage("O valor é obrigatório.")
            .GreaterThan(0).WithMessage("O valor deve ser maior que zero.");

        RuleFor(x => x.Tipo)
            .NotNull().WithMessage("O tipo é obrigatório.")
            .Must(tipo =>
                tipo == (int)TipoTransacao.Despesa ||
                tipo == (int)TipoTransacao.Receita)
            .WithMessage("O tipo deve ser despesa ou receita.");

        RuleFor(x => x.PessoaId)
            .NotNull().WithMessage("A pessoa é obrigatória.")
            .NotEqual(Guid.Empty).WithMessage("A pessoa é obrigatória.");

        RuleFor(x => x.CategoriaId)
            .NotNull().WithMessage("A categoria é obrigatória.")
            .NotEqual(Guid.Empty).WithMessage("A categoria é obrigatória.");
    }
}
