using ControleGastos.Api.Extensions;
using ControleGastos.Application.Interfaces;
using ControleGastos.Application.Services;
using ControleGastos.Infrastructure.Persistence;
using ControleGastos.Infrastructure.Repositories;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// SQLite foi escolhido por atender o requisito de persistência após reinicialização
// com baixa complexidade de setup para o teste técnico
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Os validators são registrados por assembly para evitar configuração manual de cada classe de validação
builder.Services.AddValidatorsFromAssemblyContaining<ControleGastos.Application.Validators.Pessoas.CriarPessoaRequestValidator>();

builder.Services.AddScoped<IPessoaService, PessoaService>();
builder.Services.AddScoped<IPessoaRepository, PessoaRepository>();
builder.Services.AddScoped<ICategoriaService, CategoriaService>();
builder.Services.AddScoped<ICategoriaRepository, CategoriaRepository>();
builder.Services.AddScoped<ITransacaoService, TransacaoService>();
builder.Services.AddScoped<ITransacaoRepository, TransacaoRepository>();
builder.Services.AddScoped<IRelatorioService, RelatorioService>();

builder.Services.AddCors(options =>
{
    // CORS liberado apenas para o front local durante o desenvolvimento
    options.AddPolicy("frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// O middleware global deve ser executado cedo no pipeline para capturar exceções das demais camadas
app.UseGlobalExceptionHandling();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "v1");
    });
}

app.UseCors("frontend");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();