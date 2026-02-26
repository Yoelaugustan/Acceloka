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
            var bookings = await _db.Bookings
                .Include(b => b.BookedTickets)
                    .ThenInclude(bt => bt.TicketCodeNavigation)
                .OrderByDescending(b => b.BookedTicketId)
                .ToListAsync(ct);

            var result = bookings.Select(b => new
            {
                bookedTicketId = b.BookedTicketId,
                totalTickets = b.BookedTickets.Sum(bt => bt.Quantity),
                totalPrice = b.BookedTickets.Sum(bt => bt.Quantity * bt.TicketCodeNavigation.Price)
            });

            return Results.Ok(result);
        }
    }
}
