export interface SidebarContextType {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}
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
  categoryName: string;
  quota: number;
  eventDate: string;
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

export interface TicketCardProps extends Ticket {
  onBookClick: (ticket: Ticket) => void;
}

export interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookedTicketId: number | null;
}

export interface RevokeModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookedTicketId: number | null;
  onSuccess: () => void;
}

export interface BookingTicketProps {
  booking: BookingSummary;
  onViewDetails: (id: number) => void;
  onRevoke: (id: number) => void;
}

export interface BookingSummary {
  bookedTicketId: number;
  totalTickets: number;
  totalPrice: number;
}

export interface BookingListResponse {
  bookings: BookingSummary[];
  totalBookings: number;
  pages: string;
}

export interface BookedTicketItem {
  ticketCode: string;
  ticketName: string;
  eventDate: string;
  quantity: number;
  quota: number;
}

export interface BookedTicketCategoryDetail {
  qtyPerCategory: number;
  categoryName: string;
  tickets: BookedTicketItem[];
}

export interface StatusModalProps {
  isOpen: boolean;
  type: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
}
export interface DeleteConfirmModalProps {
  isOpen: boolean;
  ticketCode: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}
