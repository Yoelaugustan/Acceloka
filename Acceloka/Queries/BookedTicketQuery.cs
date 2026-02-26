using MediatR;

namespace Acceloka.Queries
{
    public record BookedTicketQuery(int BookedTicketId) : IRequest<IResult>;
}
