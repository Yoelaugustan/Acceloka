import { api } from '@/lib/api';
import { TicketListResponse, ProblemDetails } from '@/types/api';

export default async function Home() {
  let data: TicketListResponse | null = null;
  let errorDetail: ProblemDetails | null = null;

  try {
    const response = await api.get<TicketListResponse>("/v1/get-available-ticket");
    data = response.data;
  } catch (err: any) {
    errorDetail = err.response?.data || {
      title: "Connection Failed",
      detail: "The backend server is not responding.",
      status: 500
    };
  }

  // Handle Error View
  if (errorDetail) {
    return (
      <div className="p-10 text-red-600 bg-red-50 border border-red-200 rounded">
        <h1 className="text-xl font-bold">{errorDetail.title}</h1>
        <p>{errorDetail.detail}</p>
        <span className="text-sm font-mono text-red-400">Status: {errorDetail.status}</span>
      </div>
    );
  }

  // Handle Success View
  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-6">Acceloka Tickets</h1>
      <div className="grid gap-4">
        {data?.tickets.map((ticket) => (
          <div key={ticket.ticketCode} className="p-4 border rounded shadow-sm hover:shadow-md transition">
             <div className="flex justify-between items-center">
                <div>
                   <h2 className="font-semibold text-lg">{ticket.ticketName}</h2>
                   <p className="text-gray-500 text-sm">{ticket.categoryName} • {ticket.eventDate}</p>
                </div>
                <div className="text-right">
                   <p className="font-bold text-green-600">Rp {ticket.price.toLocaleString()}</p>
                   <p className="text-xs text-gray-400">Stock: {ticket.quota}</p>
                </div>
             </div>
          </div>
        ))}
      </div>
    </main>
  );
}