using Acceloka.Entities;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Configure sql server
builder.Services.AddEntityFrameworkSqlServer();
builder.Services.AddDbContextPool<AccelokaDbContext>(options =>
{
    var conString = configuration.GetConnectionString("SQLServerDB");
    options.UseSqlServer(conString);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
