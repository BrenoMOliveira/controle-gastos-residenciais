using ControleGastos.Application.DTOs.Pessoas;
using FluentValidation;

namespace ControleGastos.Application.Validators.Pessoas;

public class AtualizarPessoaRequestValidator : AbstractValidator<AtualizarPessoaRequest>
{
    public AtualizarPessoaRequestValidator()
    {
        RuleFor(x => x.Nome)
            .NotEmpty().WithMessage("O nome é obrigatório.")
            .MaximumLength(200).WithMessage("O nome deve ter no máximo 200 caracteres.");

        RuleFor(x => x.Idade)
            .NotNull().WithMessage("A idade é obrigatória.")
            .GreaterThanOrEqualTo(0).WithMessage("A idade deve ser maior ou igual a zero.");
    }
}