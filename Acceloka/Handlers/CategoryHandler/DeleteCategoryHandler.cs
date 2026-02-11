using Acceloka.Commands.Category;
using Acceloka.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.Handlers.CategoryHandler
{
    public class DeleteCategoryHandler : IRequestHandler<DeleteCategoryCommand, IResult>
    {
        private readonly AccelokaDbContext _db;
        private readonly IValidator<DeleteCategoryCommand> _validator;

        public DeleteCategoryHandler(AccelokaDbContext db, IValidator<DeleteCategoryCommand> validator)
        {
            _db = db;
            _validator = validator;
        }

        public async Task<IResult> Handle(DeleteCategoryCommand request, CancellationToken ct)
        {
            // Input Validation
            var validationResult = await _validator.ValidateAsync(request, ct);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var category = await _db.Categories
                .FirstOrDefaultAsync(c => c.CategoryName.ToLower() == request.CategoryName.ToLower(), ct);

            // validate category exist
            if (category == null)
            {
                return Results.Problem(
                    detail: $"Category '{request.CategoryName}' does not exists.",
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Validation Error"
                );
            }

            // check if category has related tickets
            var hasRelatedTickets = await _db.Tickets
                .AnyAsync(t => t.CategoryName == category.CategoryName, ct);

            if (hasRelatedTickets)
            {
                return Results.Problem(
                    detail: $"Category '{request.CategoryName}' cannot be deleted because it has related tickets.",
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Validation Error"
                );
            }

            // delete category
            _db.Categories.Remove(category);
            await _db.SaveChangesAsync(ct);

            // get remaining categories
            var remainingCategories = await _db.Categories
                .Select(c => new
                {
                    categoryName = c.CategoryName
                })
                .ToListAsync(ct);

            return Results.Ok(remainingCategories);
        }
    }
}
