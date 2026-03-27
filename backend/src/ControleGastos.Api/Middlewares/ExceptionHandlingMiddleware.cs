using System.Text.Json;
using ControleGastos.Api.Models;
using ControleGastos.Application.Exceptions;
using FluentValidation;

namespace ControleGastos.Api.Middlewares;

/// <summary>
/// Middleware global responsável por transformar exceções da aplicação em respostas HTTP padronizadas
/// Isso evita try/catch repetido nos controllers e centraliza o tratamento de erros
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            await HandleExceptionAsync(context, exception);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        ErrorResponse response;

        switch (exception)
        {
            // ValidationException representa erros de entrada/validação de request - retornam 400
            case ValidationException validationException:
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                response = new ErrorResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Mensagem = "Erro de validação.",
                    Erros = validationException.Errors
                        .Select(error => new ValidationErrorItem
                        {
                            Campo = error.PropertyName,
                            Mensagem = error.ErrorMessage
                        })
                        .ToList()
                };
                break;
            // NotFoundException representa ausência de recurso - retornam 404
            case NotFoundException notFoundException:
                context.Response.StatusCode = StatusCodes.Status404NotFound;
                response = new ErrorResponse
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Mensagem = notFoundException.Message
                };
                break;
            // BusinessRuleException representa quebra de regra de negócio - retornam 400
            case BusinessRuleException businessRuleException:
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                response = new ErrorResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Mensagem = businessRuleException.Message
                };
                break;
            // Exceções não tratadas retornam 500
            default:
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                response = new ErrorResponse
                {
                    StatusCode = StatusCodes.Status500InternalServerError,
                    Mensagem = "Ocorreu um erro interno inesperado."
                };
                break;
        }

        var json = JsonSerializer.Serialize(response);
        await context.Response.WriteAsync(json);
    }
}