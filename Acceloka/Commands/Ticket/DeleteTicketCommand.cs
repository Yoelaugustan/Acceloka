using MediatR;

namespace Acceloka.Commands.Ticket
{
    public record DeleteTicketCommand(string TicketCode) : IRequest<IResult>;
}
