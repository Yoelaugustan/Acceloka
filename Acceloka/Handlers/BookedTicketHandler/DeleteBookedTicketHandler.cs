using Acceloka.Commands.BookedTicket;
using Acceloka.Entities;
using Acceloka.Queries;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Acceloka.Handlers.BookedTicketHandler
{

    public class DeleteBookedTicketHandler : IRequestHandler<DeleteTicketCommand, IResult>
    {
        private readonly AccelokaDbContext _db;
        private readonly IValidator<DeleteTicketCommand> _validator;

        public DeleteBookedTicketHandler(AccelokaDbContext db, IValidator<DeleteTicketCommand> validator)
        {
            _db = db;
            _validator = validator;
        }

        public async Task<IResult> Handle(DeleteTicketCommand request, CancellationToken ct)
        {
            var booking = await _db.BookedTickets
                .Include(b => b.TicketCodeNavigation)
                .FirstOrDefaultAsync(bt => bt.BookedTicketId == request.BookedTickedIt && bt.TicketCode == request.TicketCode, ct);

            // validate booking exists
            if (booking == null)
            {
                return Results.Problem(
                    detail: $"Booked Ticket with ID '{request.BookedTickedIt}' or Ticket Code '{request.TicketCode}' does not exists.",
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Validation Error"
                );
            }

            // input validation
            var validationResult = await _validator.ValidateAsync(request, ct);
            if (!validationResult.IsValid)
            {
                // Kembalikan format RFC 7807 secara otomatis
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            // validate revoke quantity with booked quantity
            if (request.Quantity > booking.Quantity)
            {
                return Results.Problem(
                    detail: $"Revoke quantity '{request.Quantity}' exceeds booked quantity '{booking.Quantity}'.",
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Validation Error"
                );
            }

            // restore ticket quota
            booking.TicketCodeNavigation.Quota += request.Quantity;

            if (request.Quantity == booking.Quantity)
            {
                // remove the booking
                _db.BookedTickets.Remove(booking);
            }
            else
            {
                // reduce the booked quantity
                booking.Quantity -= request.Quantity;
            }

            await _db.SaveChangesAsync(ct);

            // Get all booked tickets with ticket details
            var allBookings = await _db.BookedTickets
                .Include(b => b.TicketCodeNavigation)
                .ToListAsync(ct);

            var result = allBookings
                .Select(t => new
                {
                    ticketCode = t.TicketCode,
                    ticketName = t.TicketCodeNavigation.TicketName,
                    quantity = t.Quantity,
                    CategoryName = t.TicketCodeNavigation.CategoryName,
                }).ToList();

            return Results.Ok(new
            {
                bookings = result
            });
        }
    }
}
