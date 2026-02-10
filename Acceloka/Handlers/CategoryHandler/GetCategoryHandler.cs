using Acceloka.Entities;
using Acceloka.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.Handlers.CategoryHandler
{
    public class GetCategoryHandler : IRequestHandler<CategoriesQuery, IResult>
    {
        private readonly AccelokaDbContext _db;

        public GetCategoryHandler(AccelokaDbContext db)
        {
            _db = db;
        }

        public async Task<IResult> Handle(CategoriesQuery request, CancellationToken ct)
        {
            var categories = await _db.Categories
                .Select(c => new
                {
                    categoryName = c.CategoryName
                })
                .ToListAsync(ct);

            return Results.Ok(categories);
        }
    }
}
