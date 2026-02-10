using Acceloka.Entities;
using Acceloka.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.Handlers.CategoryHandler
{
    public class GetTicketHandler : IRequestHandler<TicketsQuery, IResult>
    {
        private readonly AccelokaDbContext _db;

        public GetTicketHandler(AccelokaDbContext db)
        {
            _db = db;
        }

        public async Task<IResult> Handle(TicketsQuery request, CancellationToken ct)
        {
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

            // Show Result
            var result = await query.Select(t => new
            {
                categoryName = t.CategoryName,
                ticketCode = t.TicketCode,
                ticketName = t.TicketName,
                eventDate = t.EventDate.ToString("dd-MM-yyyy HH:mm"),
                price = t.Price,
                quota = t.Quota
            }).ToListAsync(ct);

            return Results.Ok(new { tickets = result });

        }
    }
}
