using MediatR;

namespace Acceloka.Queries
{
    public class TicketsQuery : IRequest<IResult>
    {
        public string? categoryName { get; set; }
        public string? ticketCode { get; set; }
        public string? ticketName { get; set; }
        public decimal? maxPrice { get; set; }
        public DateTime? minEventDate { get; set; }
        public DateTime? maxEventDate { get; set; }
        public string? orderBy { get; set; } = "ticketCode";
        public string? orderState { get; set; } = "asc";
    }
}
