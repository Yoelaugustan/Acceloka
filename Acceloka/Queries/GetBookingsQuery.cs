using MediatR;

namespace Acceloka.Queries
{
    public record GetBookingsQuery : IRequest<IResult>;
}
