using MediatR;

namespace Acceloka.Commands
{
    public class BookedTicketCommand : IRequest<IResult>
    {
        public string TicketCode { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }
}
