using MediatR;

namespace Acceloka.Commands.BookedTicket
{
    public record DeleteTicketCommand(int BookedTicketId, string TicketCode, int Qty) : IRequest<IResult>;
}
