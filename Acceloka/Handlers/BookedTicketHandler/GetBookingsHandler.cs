using Acceloka.Entities;
using Acceloka.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.Handlers.BookedTicketHandler
{
    public class GetBookingsHandler : IRequestHandler<GetBookingsQuery, IResult>
    {
        private readonly AccelokaDbContext _db;

        public GetBookingsHandler(AccelokaDbContext db)
        {
            _db = db;
        }

        public async Task<IResult> Handle(GetBookingsQuery request, CancellationToken ct)
        {
            const int DEFAULT_PAGE_SIZE = 10;
            var query = _db.Bookings.AsQueryable();

            var totalBookings = await query.CountAsync(ct);
            int totalPages = (int)Math.Ceiling((double)totalBookings / DEFAULT_PAGE_SIZE);

            var bookings = await query
                .Include(b => b.BookedTickets)
                    .ThenInclude(bt => bt.TicketCodeNavigation)
                .OrderByDescending(b => b.BookedTicketId)
                .Skip((request.PageNumber - 1) * DEFAULT_PAGE_SIZE)
                .Take(DEFAULT_PAGE_SIZE)
                .ToListAsync(ct);

            var result = bookings.Select(b => new
            {
                bookedTicketId = b.BookedTicketId,
                totalTickets = b.BookedTickets.Sum(bt => bt.Quantity),
                totalPrice = b.BookedTickets.Sum(bt => bt.Quantity * bt.TicketCodeNavigation.Price)
            });

            return Results.Ok(new
            {
                bookings = result,
                totalBookings = totalBookings,
                pages = $"{request.PageNumber}/{totalPages}"
            });
        }
    }
}
