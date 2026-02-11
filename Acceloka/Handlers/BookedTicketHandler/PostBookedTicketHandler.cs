using Acceloka.Commands.BookedTicket;
using Acceloka.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Net.Sockets;

namespace Acceloka.Handlers.BookedTicketHandler
{
    public class PostBookedTicketHandler : IRequestHandler<PostBookedTicketCommand, IResult>
    {
        private readonly AccelokaDbContext _db;
        private readonly IValidator<PostBookedTicketCommand> _validator;

        public PostBookedTicketHandler(AccelokaDbContext db, IValidator<PostBookedTicketCommand> validator)
        {
            _db = db;
            _validator = validator;
        }

        public async Task<IResult> Handle(PostBookedTicketCommand request, CancellationToken ct)
        {
            // Check if ticket code exists
            var ticket = await _db.Tickets
                .FirstOrDefaultAsync(t => t.TicketCode == request.TicketCode, ct);

            if (ticket == null)
            {
                return Results.Problem(
                    detail: $"Ticket '{request.TicketCode}' does not exists.",
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Validation Error"
                );
            }

            // validate ticket quota
            if (ticket.Quota <= 0)
            {
                return Results.Problem(
                    detail: $"Ticket '{request.TicketCode}' quota is sold out",
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Validation Error"
                );
            }

            // validate event date
            if (ticket.EventDate <= DateTime.UtcNow.Date)
            {
                return Results.Problem(
                    detail: $"Ticket '{request.TicketCode}' event date has passed",
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

            // validate quantity with quota
            if (request.Quantity > ticket.Quota)
            {
                return Results.Problem(
                    detail: $"Ticket '{request.TicketCode}' only has {ticket.Quota} quota left",
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Validation Error"
                );
            }

            // reduce ticket quota
            ticket.Quota -= request.Quantity;

            // Insert to DB
            var newBookedTicket = new BookedTicket
            {
                TicketCode = request.TicketCode,
                Quantity = request.Quantity,
            };

            _db.BookedTickets.Add(newBookedTicket);
            await _db.SaveChangesAsync(ct);

            // Get all booked tickets with tickets details
            var allBookings = await _db.BookedTickets
                .Include(b => b.TicketCodeNavigation)
                .ToListAsync(ct);

            var ticketsPerCategories = allBookings
                .GroupBy(b => b.TicketCodeNavigation.CategoryName) // categories the booking
                .Select(g => new    // select each category
                {
                    categoryName = g.Key,
                    summaryPrice = g.Sum(x => x.TicketCodeNavigation.Price * x.Quantity),
                    tickets = g.Select(x => new // select each ticket in the category
                    {
                        ticketCode = x.TicketCode,
                        ticketName = x.TicketCodeNavigation.TicketName,
                        price = x.TicketCodeNavigation.Price * x.Quantity
                    }).ToList()
                }).ToList();

            // total price
            var priceSummary = ticketsPerCategories.Sum(c => c.summaryPrice);

            return Results.Ok(new
            {
                priceSummary = priceSummary,
                ticketsPerCategories = ticketsPerCategories
            });
        }
    }
}
