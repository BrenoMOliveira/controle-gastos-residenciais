using ControleGastos.Application.DTOs.Categorias;
using ControleGastos.Domain.Enums;
using FluentValidation;

namespace ControleGastos.Application.Validators.Categorias;

public class CriarCategoriaRequestValidator : AbstractValidator<CriarCategoriaRequest>
{
    public CriarCategoriaRequestValidator()
    {
        RuleFor(x => x.Descricao)
            .NotEmpty().WithMessage("A descrição é obrigatória.")
            .MaximumLength(400).WithMessage("A descrição deve ter no máximo 400 caracteres.");

        RuleFor(x => x.Finalidade)
            .NotNull().WithMessage("A finalidade é obrigatória.")
            .Must(finalidade => 
                  finalidade == (int)FinalidadeCategoria.Despesa ||
                  finalidade == (int)FinalidadeCategoria.Receita ||
                  finalidade == (int)FinalidadeCategoria.Ambas)
            .WithMessage("A finalidade deve ser despesa, receita ou ambas.");
    }
}
