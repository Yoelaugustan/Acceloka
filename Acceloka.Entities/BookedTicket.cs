using System;
using System.Collections.Generic;

namespace Acceloka.Entities;

public partial class BookedTicket
{
    public int BookedTicketId { get; set; }

    public string TicketCode { get; set; } = null!;

    public int Quantity { get; set; }

    public virtual Ticket TicketCodeNavigation { get; set; } = null!;
}
