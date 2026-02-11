using Acceloka.Commands;
using Acceloka.Entities;
using Acceloka.Queries;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

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
            var exist = await _db.BookedTickets
                .AnyAsync(bt => bt.BookedTicketId == request.BookedTicketId, ct);

            if (!exist)
            {
                return Results.Problem(
                    detail: $"Booked Ticket with ID '{request.BookedTicketId}' does not exists.",
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

            // Get all booked tickets with ticket details
            var allBookings = await _db.BookedTickets
                .Include(b => b.TicketCodeNavigation)
                .ToListAsync(ct);

            var ticketsPerCategories = allBookings
                .GroupBy(b => b.TicketCodeNavigation.CategoryName) // categories the booking
                .Select(g => new    // select each category
                {
                    qtyPerCategory = g.Sum(x => x.Quantity),
                    categoryName = g.Key,
                    tickets = g.Select(x => new // select each ticket in the category
                    {
                        ticketCode = x.TicketCode,
                        ticketName = x.TicketCodeNavigation.TicketName,
                        eventDate = x.TicketCodeNavigation.EventDate.ToString("dd-MM-yyyy HH:mm"),
                    }).ToList()
                }).ToList();

            return Results.Ok(new
            {
                ticketsPerCategories = ticketsPerCategories
            });
        }
    }
}
