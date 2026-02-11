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
            // input validation
            var validationResult = await _validator.ValidateAsync(request, ct);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            // validate booking id exist
            var bookingHeader = await _db.Bookings
                .FirstOrDefaultAsync(x => x.BookedTicketId == request.BookedTicketId, ct);

            if (bookingHeader == null)
            {
                return Results.Problem(
                    detail: $"BookedtiketId {request.BookedTicketId} does not exist",
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Validation Error"
                );
            }

            // validate ticket code exist in booking
            var detail = await _db.BookedTickets
                .Include(x => x.TicketCodeNavigation)
                .FirstOrDefaultAsync(x => x.BookedTicketId == request.BookedTicketId && x.TicketCode == request.TicketCode, ct);

            if (detail == null)
            {
                return Results.Problem(
                    detail: $"Ticket code '{request.TicketCode}' is not found in booking id '{request.BookedTicketId}'.",
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Validation Error"
                );
            }

            // validate requested quantity and booked quantity
            if (request.Qty > detail.Quantity)
            {
                return Results.Problem(
                    detail: $"Requested quantity {request.Qty} exceeds the booked quantity {detail.Quantity} for ticket code '{request.TicketCode}'.",
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Validation Error"
                );
            }

            // restore ticket quota
            detail.TicketCodeNavigation.Quota += request.Qty;

            if (request.Qty == detail.Quantity)
            {
                // remove the booking
                _db.BookedTickets.Remove(detail);
            }
            else
            {
                // reduce the booked quantity
                detail.Quantity -= request.Qty;
            }

            await _db.SaveChangesAsync(ct);

            // check if there are other details in the booking
            bool hasOtherDetails = await _db.BookedTickets
                .AnyAsync(x => x.BookedTicketId == request.BookedTicketId, ct);

            if (!hasOtherDetails)
            {
                _db.Bookings.Remove(bookingHeader);
                await _db.SaveChangesAsync(ct);
            }

            // get remaining tickets in the booking
            var remainingTickets = await _db.BookedTickets
                .Include(x => x.TicketCodeNavigation)
                .Where(x => x.BookedTicketId == request.BookedTicketId)
                .Select(t => new
                {
                    ticketCode = t.TicketCode,
                    ticketName = t.TicketCodeNavigation.TicketName,
                    quantity = t.Quantity,
                    categoryName = t.TicketCodeNavigation.CategoryName
                })
                .ToListAsync(ct);

            // no remaining tickets
            if (!remainingTickets.Any())
            {
                return Results.Ok(new { message = "All tickets in this booking have been revoked." });
            }

            return Results.Ok(remainingTickets);
        }
    }
}
