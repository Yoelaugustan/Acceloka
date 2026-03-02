using MediatR;

namespace Acceloka.Queries
{
    public record GetBookingsQuery(int? UserId = null, int PageNumber = 1) : IRequest<IResult>;
}
