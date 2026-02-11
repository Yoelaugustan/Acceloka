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
            // Input Validation
            var validationResult = await _validator.ValidateAsync(request, ct);

            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            // get all tickets based on input
            var ticketCodes = request.BookingItems.Select(b => b.TicketCode.ToUpper()).ToList();
            var allTickets = await _db.Tickets
                .Where(t => ticketCodes.Contains(t.TicketCode.ToUpper()))
                .ToListAsync(ct);

            // validate each ticket
            foreach (var req in request.BookingItems)
            {
                var ticket = allTickets.FirstOrDefault(t => t.TicketCode == req.TicketCode); // validate if input ticket code exists in DB

                // return error if ticket code is not found
                if (ticket == null)
                {
                    return Results.Problem(
                        detail: $"Ticket '{req.TicketCode}' does not exists.",
                        statusCode: StatusCodes.Status400BadRequest,
                        title: "Validation Error"
                    );
                }

                // return if ticket quota is not enough
                if (ticket.Quota <= 0)
                {
                    return Results.Problem(
                        detail: $"Ticket '{req.TicketCode}' is out of stock.",
                        statusCode: StatusCodes.Status400BadRequest,
                        title: "Validation Error"
                    );
                }

                // return if ticket quota is not enough
                if (ticket.Quota < req.Quantity)
                {
                    return Results.Problem(
                        detail: $"Ticket '{req.TicketCode}' has only {ticket.Quota} tickets left.",
                        statusCode: StatusCodes.Status400BadRequest,
                        title: "Validation Error"
                    );
                }

                // return if ticket event date has passed
                if (ticket.EventDate < DateTime.Now)
                {
                    return Results.Problem(
                        detail: $"Ticket '{req.TicketCode}' event date has passed.",
                        statusCode: StatusCodes.Status400BadRequest,
                        title: "Validation Error"
                    );
                }
            }

            // insert to DB

            // create new booking
            var newBooking = new Booking();
            _db.Bookings.Add(newBooking);

            await _db.SaveChangesAsync(ct);

            foreach (var req in request.BookingItems)
            {
                var ticket = allTickets.First(t => t.TicketCode == req.TicketCode);

                // reduce ticket quota
                ticket.Quota -= req.Quantity;

                // add booked detail
                _db.BookedTickets.Add(new BookedTicket
                {
                    BookedTicketId = newBooking.BookedTicketId,
                    TicketCode = req.TicketCode,
                    Quantity = req.Quantity
                });
            }

            await _db.SaveChangesAsync(ct);

            // prepare response
            var details = await _db.BookedTickets
                .Include(b => b.TicketCodeNavigation)
                .Where(b => b.BookedTicketId == newBooking.BookedTicketId)
                .ToListAsync(ct);

            var grouped = details.GroupBy(d => d.TicketCodeNavigation.CategoryName)
                .Select(g => new {
                    categoryName = g.Key,
                    summaryPrice = g.Sum(x => x.TicketCodeNavigation.Price * x.Quantity),
                    tickets = g.Select(x => new {
                        ticketCode = x.TicketCode,
                        ticketName = x.TicketCodeNavigation.TicketName,
                        price = x.TicketCodeNavigation.Price * x.Quantity
                    }).ToList()
                }).ToList();

            return Results.Ok(new
            {
                priceSummary = grouped.Sum(x => x.summaryPrice),
                ticketsPerCategories = grouped
            });
        }
    }
}
