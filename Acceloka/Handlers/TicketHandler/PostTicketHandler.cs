using Acceloka.Commands;
using Acceloka.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Acceloka.Handlers.TicketHandler
{
    public class PostTicketHandler : IRequestHandler<TicketCommand, IResult>
    {
        private readonly AccelokaDbContext _db;
        private readonly IValidator<TicketCommand> _validator;
        public PostTicketHandler(AccelokaDbContext db, IValidator<TicketCommand> validator)
        {
            _db = db;
            _validator = validator;
        }

        public async Task<IResult> Handle(TicketCommand request, CancellationToken ct)
        {
            var exist = await _db.Tickets
                .AnyAsync(t => t.TicketCode == request.Code, ct);

            if (exist)
            {
                return Results.Problem(
                    detail: $"Ticket '{request.Code}' already exists.",
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Validation Error"
                );
            }

            var validationResult = await _validator.ValidateAsync(request, ct);

            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var newTicket = new Ticket
            {
                TicketCode = request.Code,
                TicketName = request.Name,
                CategoryName = request.CategoryName,
                EventDate = request.EventDate,
                Price = request.Price,
                Quota = request.Quota
            };

            _db.Tickets.Add(newTicket);
            await _db.SaveChangesAsync(ct);

            return Results.Ok(new
            {
                ticketCode = newTicket.TicketCode,
                ticketName = newTicket.TicketName,
                categoryName = newTicket.CategoryName,
                eventDate = newTicket.EventDate.ToString("dd-MM-yyyy HH:mm"),
                price = newTicket.Price,
                quota = newTicket.Quota
            });
        }
    }
}
