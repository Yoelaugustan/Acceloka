using Acceloka.Commands.Ticket;
using Acceloka.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.Handlers.TicketHandler
{
    public class DeleteTicketHandler : IRequestHandler<DeleteTicketCommand, IResult>
    {
        private readonly AccelokaDbContext _db;
        private readonly IValidator<DeleteTicketCommand> _validator;
        public DeleteTicketHandler(AccelokaDbContext db, IValidator<DeleteTicketCommand> validator)
        {
            _db = db;
            _validator = validator;
        }

        public async Task<IResult> Handle(DeleteTicketCommand request, CancellationToken ct)
        {
            // Input Validation
            var validationResult = await _validator.ValidateAsync(request, ct);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }


            var ticket = await _db.Tickets
                .FirstOrDefaultAsync(x => x.TicketCode == request.TicketCode, ct);

            // validate ticket exist
            if (ticket == null)
            {
                return Results.Problem(
                    detail: $"Ticket '{request.TicketCode}' does not exist.",
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Not Found"
                );
            }

            // store category of deleted ticket
            var categoryOfDeletedTicket = ticket.CategoryName;

            var hasRelatedBookings = await _db.BookedTickets
                .AnyAsync(bt => bt.TicketCode == request.TicketCode, ct);

            if (hasRelatedBookings)
            {
                return Results.Problem(
                    detail: $"Ticket '{request.TicketCode}' cannot be deleted because it has related bookings.",
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Validation Error"
                );
            }

            _db.Tickets.Remove(ticket);
            await _db.SaveChangesAsync(ct);

            // get remaining tickets in the same category
            var remainingTickets = await _db.Tickets
                .Where(t => t.CategoryName == categoryOfDeletedTicket)
                .Select(t => new {
                    ticketCode = t.TicketCode,
                    ticketName = t.TicketName,
                    quota = t.Quota,
                    categoryName = t.CategoryName
                })
                .ToListAsync(ct);

            return Results.Ok(remainingTickets);
        }
    }
}
