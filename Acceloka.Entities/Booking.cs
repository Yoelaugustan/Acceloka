using System;
using System.Collections.Generic;

namespace Acceloka.Entities;

public partial class Booking
{
    public int BookedTicketId { get; set; }

    public int UserId { get; set; }

    public DateTime? BookingDate { get; set; }

    public virtual ICollection<BookedTicket> BookedTickets { get; set; } = new List<BookedTicket>();

    public virtual User User { get; set; } = null!;
}
