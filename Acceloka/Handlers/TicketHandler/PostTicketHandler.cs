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
            // input validation
            var validationResult = await _validator.ValidateAsync(request, ct);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            // check if there is an existing ticket
            var existingTicketCodes = await _db.Tickets
                .Where(t => request.Tickets.Select(rt => rt.Code).Contains(t.TicketCode))
                .Select(t => t.TicketCode)
                .ToListAsync(ct);

            if (existingTicketCodes.Any())
            {
                return Results.Problem(
                    detail: $"The following ticket codes already exist: {string.Join(", ", existingTicketCodes)}",
                    statusCode: StatusCodes.Status400BadRequest,
                    title: "Validation Error"
                );
            }

            // Add to DB
            var newTickets = new List<Ticket>();
            foreach (var ticketInput in request.Tickets)
            {
                var newTicket = new Ticket
                {
                    TicketCode = ticketInput.Code,
                    TicketName = ticketInput.Name,
                    CategoryName = ticketInput.CategoryName,
                    EventDate = ticketInput.EventDate,
                    Price = ticketInput.Price,
                    Quota = ticketInput.Quota
                };
                newTickets.Add(newTicket);
            }
            

            _db.Tickets.AddRange(newTickets);
            await _db.SaveChangesAsync(ct);

            var createdTicketsResponse = newTickets.Select(t => new
            {
                ticketCode = t.TicketCode,
                ticketName = t.TicketName,
                categoryName = t.CategoryName,
                eventDate = t.EventDate.ToString("dd-MM-yyyy HH:mm"),
                price = t.Price,
                quota = t.Quota
            }).ToList();

            return Results.Ok(createdTicketsResponse);
        }
    }
}
