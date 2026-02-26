using MediatR;

namespace Acceloka.Commands.BookedTicket
{
    public class PostBookedTicketCommand : IRequest<IResult>
    {
        public List<PostBookingRequestItem> BookingItems { get; set; } = new();
    }

    public class PostBookingRequestItem
    {
        public string TicketCode { get; set; } = null!;
        public int Quantity { get; set; }
    }
}
