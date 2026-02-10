using MediatR;

namespace Acceloka.Commands.BookedTicket
{
    public class PostBookedTicketCommand : IRequest<IResult>
    {
        public string TicketCode { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }
}
