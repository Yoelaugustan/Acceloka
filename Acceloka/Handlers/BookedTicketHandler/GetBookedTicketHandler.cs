using Acceloka.Commands;
using Acceloka.Entities;
using Acceloka.Queries;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace Acceloka.Handlers.BookedTicketHandler
{
    public class GetBookedTicketHandler : IRequestHandler<BookedTicketQuery, IResult>
    {
        private readonly AccelokaDbContext _db;
        private readonly IValidator<BookedTicketQuery> _validator;

        public GetBookedTicketHandler(AccelokaDbContext db, IValidator<BookedTicketQuery> validator)
        {
            _db = db;
            _validator = validator;
        }

        public async Task<IResult> Handle(BookedTicketQuery request, CancellationToken ct)
        {
            // Input Validation
            var validationResult = await _validator.ValidateAsync(request, ct);

            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var bookingDetails = await _db.BookedTickets
                .Include(x => x.TicketCodeNavigation)
                .Where(x => x.BookedTicketId == request.BookedTicketId)
                .ToListAsync(ct);

            // validate in booking exists
            if (!bookingDetails.Any())
            {
                return Results.Problem(
                    detail: $"BookedtiketId {request.BookedTicketId} does not exist",
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Validation Error"
                );
            }

            // get tickets per categories
            var result = bookingDetails
                .GroupBy(x => x.TicketCodeNavigation.CategoryName)
                .Select(group => new
                {
                    qtyPerCategory = group.Sum(x => x.Quantity),
                    categoryName = group.Key,
                    tickets = group.Select(t => new
                    {
                        ticketCode = t.TicketCode,
                        ticketName = t.TicketCodeNavigation.TicketName,
                        eventDate = t.TicketCodeNavigation.EventDate.ToString("dd-MM-yyyy HH:mm"),
                        quantity = t.Quantity,
                        quota = t.TicketCodeNavigation.Quota
                    }).ToList()
                }).ToList();

            return Results.Ok(result);
        }
    }
}
