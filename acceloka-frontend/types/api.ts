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
export interface FilterData {
  priceRange: [number, number] | null;
  category: string | null;
  orderBy: string;
  orderState: "asc" | "desc";
}

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FilterData) => void;
  initialFilters: FilterData;
}