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

export interface CartItem {
  ticketCode: string;
  quantity: number;
  ticketName: string;
  price: number;
}

export type ModalMode = "book" | "create";

export interface BookModalProps {
  ticket: Ticket;
  onClose: () => void;
}

export interface CreateModalProps {
  onClose: () => void;
  onCreated: (ticket: Ticket) => void;
}

export interface TicketModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export interface CartItem {
  ticketCode: string;
  quantity: number;
  ticketName: string;
  price: number;
  categoryName: string;
  quota: number;
  eventDate: string;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (ticketCode: string, quantity: number, ticketName: string, price: number, categoryName: string, quota: number, eventDate: string) => void;
  removeFromCart: (ticketCode: string) => void;
  updateCartQuantity: (ticketCode: string, newQuantity: number) => void;
  getUniqueItemCount: () => number;
}

export interface TicketCardProps extends Ticket {
  onBookClick: (ticket: Ticket) => void;
}

export interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface StatusModalProps {
  isOpen: boolean;
  type: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
}
