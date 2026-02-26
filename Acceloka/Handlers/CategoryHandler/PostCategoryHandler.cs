using Acceloka.Commands.Category;
using Acceloka.Entities;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Acceloka.Handlers.CategoryHandler
{
    public class PostCategoryHandler : IRequestHandler<PostCategoryCommand, IResult>
    {
        private readonly AccelokaDbContext _db;
        private readonly IValidator<PostCategoryCommand> _validator;

        public PostCategoryHandler(AccelokaDbContext db, IValidator<PostCategoryCommand> validator)
        {
            _db = db;
            _validator = validator;
        }

        public async Task<IResult> Handle(PostCategoryCommand request, CancellationToken ct)
        {
            var exist = await _db.Categories
                .AnyAsync(c => c.CategoryName == request.Name, ct);

            if (exist)
            {
                return Results.Problem(
                    detail: $"Category '{request.Name}' already exists.",
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Validation Error"
                );
            }

            // Input Validation
            var validationResult = await _validator.ValidateAsync(request, ct);

            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var newCategory = new Category
            {
                CategoryName = request.Name
            };

            _db.Categories.Add(newCategory);
            await _db.SaveChangesAsync(ct);

            return Results.Ok(new
            {
                categoryName = newCategory.CategoryName
            });
        }
    }
}
