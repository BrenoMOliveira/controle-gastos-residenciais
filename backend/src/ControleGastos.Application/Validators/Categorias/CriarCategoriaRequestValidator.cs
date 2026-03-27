using ControleGastos.Application.DTOs.Categorias;
using ControleGastos.Domain.Enums;
using FluentValidation;

namespace ControleGastos.Application.Validators.Categorias;

public class CriarCategoriaRequestValidator : AbstractValidator<CriarCategoriaRequest>
{
    public CriarCategoriaRequestValidator()
    {
        RuleFor(x => x.Descricao)
            .NotEmpty().WithMessage("A descricao e obrigatoria.")
            .MaximumLength(400).WithMessage("A descricao deve ter no maximo 400 caracteres.");

        RuleFor(x => x.Finalidade)
            .NotNull().WithMessage("A finalidade e obrigatoria.")
            .Must(finalidade => 
                  finalidade == (int)FinalidadeCategoria.Despesa ||
                  finalidade == (int)FinalidadeCategoria.Receita ||
                  finalidade == (int)FinalidadeCategoria.Ambas)
            .WithMessage("A finalidade deve ser despesa, receita ou ambas.");
    }
}
