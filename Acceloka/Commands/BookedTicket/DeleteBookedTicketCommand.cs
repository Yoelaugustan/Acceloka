using MediatR;

namespace Acceloka.Commands.BookedTicket
{
    public record DeleteBookedTicketCommand(int BookedTicketId, string TicketCode, int Qty) : IRequest<IResult>;
}
