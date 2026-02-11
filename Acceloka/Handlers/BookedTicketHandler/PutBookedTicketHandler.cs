using Acceloka.Commands.BookedTicket;
using Acceloka.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.Handlers.BookedTicketHandler
{
    public class PutBookedTicketHandler : IRequestHandler<PutBookedTicketCommand, IResult>
    {
        private readonly AccelokaDbContext _db;
        private readonly IValidator<PutBookedTicketCommand> _validator;

        public PutBookedTicketHandler(AccelokaDbContext db, IValidator<PutBookedTicketCommand> validator)
        {
            _db = db;
            _validator = validator;
        }

        public async Task<IResult> Handle(PutBookedTicketCommand request, CancellationToken ct)
        {
            // Input Validation
            var validationResult = await _validator.ValidateAsync(request, ct);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            // validate booking id exist
            var bookingExists = await _db.Bookings.AnyAsync(x => x.BookedTicketId == request.BookedTicketId, ct);
            if (!bookingExists)
            {
                return Results.Problem(
                    detail: $"BookedtiketId {request.BookedTicketId} does not exist",
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Validation Error"
                );
            }

            // take ticket detail from DB
            var currentDetails = await _db.BookedTickets
                .Include(x => x.TicketCodeNavigation)
                .Where(x => x.BookedTicketId == request.BookedTicketId)
                .ToListAsync(ct);

            foreach (var item in request.EditItem)
            {
                // validate ticket code exist in booking
                var detail = currentDetails.FirstOrDefault(x => x.TicketCode == item.TicketCode);
                if (detail == null)
                {
                    return Results.Problem(
                        detail: $"Ticket code '{item.TicketCode}' is not found in booking id '{request.BookedTicketId}'.",
                        statusCode: StatusCodes.Status400BadRequest,
                        title: "Validation Error"
                    );
                }
                // Quantity must be greater than 0
                if (item.Quantity < 1)
                {
                    return Results.Problem(
                        detail: $"Quantity for ticket code '{item.TicketCode}' must be greater than 0",
                        statusCode: StatusCodes.Status400BadRequest,
                        title: "Validation Error"
                    );
                }

                // update quantity
                // if diff is positive, means increasing quantity
                // if diff is negative, means decreasing quantity
                int diff = item.Quantity - detail.Quantity;

                if (diff > detail.TicketCodeNavigation.Quota)
                {
                    return Results.Problem(detail: $"Quantity '{item.TicketCode}' melebihi sisa quota ({detail.TicketCodeNavigation.Quota})", statusCode: 400);
                }

                detail.TicketCodeNavigation.Quota -= diff;
                detail.Quantity = item.Quantity;
            }

            await _db.SaveChangesAsync(ct);

            var response = currentDetails
                .Where(d => request.EditItem.Any(i => i.TicketCode == d.TicketCode))
                .Select(d => new {
                    ticketCode = d.TicketCode,
                    ticketName = d.TicketCodeNavigation.TicketName,
                    categoryName = d.TicketCodeNavigation.CategoryName,
                    quantity = d.Quantity
                }).ToList();

            return Results.Ok(response);
        }

    }
}
