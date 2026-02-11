using MediatR;

namespace Acceloka.Commands.Ticket
{
    public class PostTicketCommand : IRequest<IResult>
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public decimal Price { get; set; }
        public int Quota { get; set; }
    }
}
