using MediatR;

namespace Acceloka.Queries
{
    public record GetBookingsQuery(int PageNumber = 1) : IRequest<IResult>;
}
