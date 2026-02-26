export interface Category {
  categoryName: string;
}

export interface Ticket {
  ticketId: number;
  ticketCode: string;
  ticketName: string;
  categoryName: string;
  eventDate: string;
  price: number;
  quota: number;
}

export interface TicketListResponse {
  tickets: Ticket[];
  totalTickets: number;
  pages: string;
}

export interface Booking {
  bookedTicketId: number;
}

export interface BookedTicketDetail {
  bookedTicketDetailId: number;
  bookedTicketId: number;
  ticketCode: string;
  quantity: number;
}

export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}   