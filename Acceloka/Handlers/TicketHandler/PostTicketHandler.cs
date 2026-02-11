using Acceloka.Commands.Ticket;
using Acceloka.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Acceloka.Handlers.TicketHandler
{
    public class PostTicketHandler : IRequestHandler<PostTicketCommand, IResult>
    {
        private readonly AccelokaDbContext _db;
        private readonly IValidator<PostTicketCommand> _validator;
        public PostTicketHandler(AccelokaDbContext db, IValidator<PostTicketCommand> validator)
        {
            _db = db;
            _validator = validator;
        }

        public async Task<IResult> Handle(PostTicketCommand request, CancellationToken ct)
        {
            // Check if ticket code already exists
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

            // Input Validation
            var validationResult = await _validator.ValidateAsync(request, ct);

            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            // Insert to DB
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

            // Return created ticket
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
