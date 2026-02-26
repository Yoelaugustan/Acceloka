using MediatR;
using Acceloka.Entities; // Needed for Ticket entity

namespace Acceloka.Commands.Ticket
{
    public class PostTicketCommand : IRequest<IResult>
    {
        public List<TicketInput> Tickets { get; set; } = new List<TicketInput>();
    }

    public class TicketInput
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public decimal Price { get; set; }
        public int Quota { get; set; }
    }
}
