namespace ControleGastos.Api.Models;

public class ErrorResponse
{
    public int StatusCode { get; set; }
    public string Mensagem { get; set; } = string.Empty;
    public List<ValidationErrorItem>? Erros { get; set; }
}

public class ValidationErrorItem
{
    public string Campo { get; set; } = string.Empty;
    public string Mensagem { get; set; } = string.Empty;
}