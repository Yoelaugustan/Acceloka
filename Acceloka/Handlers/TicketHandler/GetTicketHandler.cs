using Acceloka.Commands;
using Acceloka.Entities;
using Acceloka.Queries;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Acceloka.Handlers.CategoryHandler
{
    public class GetTicketHandler : IRequestHandler<TicketsQuery, IResult>
    {
        private readonly AccelokaDbContext _db;
        private readonly IValidator<TicketsQuery> _validator;

        public GetTicketHandler(AccelokaDbContext db, IValidator<TicketsQuery> validator)
        {
            _db = db;
            _validator = validator;
        }

        public async Task<IResult> Handle(TicketsQuery request, CancellationToken ct)
        {
            var validationResult = await _validator.ValidateAsync(request, ct);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var query = _db.Tickets.AsQueryable();

            // Only show tickets that has quota
            query = query.Where(t => t.Quota > 0);

            // Fileter By Name
            if (!string.IsNullOrEmpty(request.categoryName))
            {
                query = query.Where(t => t.CategoryName.Contains(request.categoryName));
            }

            // Fileter By Ticket Code
            if (!string.IsNullOrEmpty(request.ticketCode))
            {
                query = query.Where(t => t.TicketCode.Contains(request.ticketCode));
            }

            // Fileter By Ticket Name
            if (!string.IsNullOrEmpty(request.ticketName))
            {
                query = query.Where(t => t.TicketName.Contains(request.ticketName));
            }

            // Filter By Max Price
            if (request.maxPrice.HasValue)
            {
                query = query.Where(t => t.Price <= request.maxPrice);
            }

            // Filter Range Tanggal
            if (request.minEventDate.HasValue)
            {
                query = query.Where(t => t.EventDate >= request.minEventDate);
            }

            if (request.maxEventDate.HasValue)
            {
                query = query.Where(t => t.EventDate <= request.maxEventDate);
            }

            // Sorting
            bool isDesc = request.orderState?.ToLower() == "desc";
            query = request.orderBy?.ToLower() switch
            {
                "categoryname" => isDesc ? query.OrderByDescending(t => t.CategoryName) : query.OrderBy(t => t.CategoryName),
                "ticketname" => isDesc ? query.OrderByDescending(t => t.TicketName) : query.OrderBy(t => t.TicketName),
                "price" => isDesc ? query.OrderByDescending(t => t.Price) : query.OrderBy(t => t.Price),
                "eventdate" => isDesc ? query.OrderByDescending(t => t.EventDate) : query.OrderBy(t => t.EventDate),
                _ => query.OrderBy(t => t.TicketCode) // Default order
            };

            var totalTickets = await query.CountAsync();

            // Show Result
            var result = await query
                .Skip((request.pageNumber-1) * request.pageSize)
                .Take(request.pageSize)
                .Select(t => new
                    {
                        eventDate = t.EventDate.ToString("dd-MM-yyyy HH:mm"),
                        quota = t.Quota,
                        ticketCode = t.TicketCode,
                        ticketName = t.TicketName,
                        categoryName = t.CategoryName,
                        price = t.Price
                    }).ToListAsync(ct);

            return Results.Ok(new 
            { 
                tickets = result,
                totalTickets = totalTickets
            });

        }
    }
}
