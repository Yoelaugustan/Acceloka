using MediatR;

namespace Acceloka.Commands.BookedTicket
{
    public class DeleteTicketCommand : IRequest<IResult>
    {
        public int BookedTickedIt { get; set; }
        public string TicketCode { get; set; } = string.Empty;
        public int Quantity { get; set; }

        public DeleteTicketCommand(int bookedTickedId, string ticketCode, int quantity)
        {
            BookedTickedIt = bookedTickedId;
            TicketCode = ticketCode;
            Quantity = quantity;
        }
    }
}
