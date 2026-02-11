using MediatR;

namespace Acceloka.Commands.BookedTicket
{
    public record PutBookedTicketCommand(int BookedTicketId, List<PutTicketRequestItem> EditItem) : IRequest<IResult>;

    public record PutTicketRequestItem(
        string TicketCode,
        int Quantity
    );
}
