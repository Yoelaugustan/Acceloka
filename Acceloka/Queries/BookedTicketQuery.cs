using MediatR;

namespace Acceloka.Queries
{
    public class BookedTicketQuery : IRequest<IResult>
    {
        public int BookedTicketId { get; set; }

        public BookedTicketQuery(int id)
        {
            BookedTicketId = id;
        }
    }
}
