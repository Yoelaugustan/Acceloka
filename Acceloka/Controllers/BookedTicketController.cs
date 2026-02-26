using Acceloka.Commands.BookedTicket;
using Acceloka.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Acceloka.Controllers
{
    [Route("api/v1/")]
    [ApiController]
    public class BookedTicketController : ControllerBase
    {
        private readonly IMediator _mediator;
        public BookedTicketController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET api/<BookedTicketController>/5
        [HttpGet("get-booked-ticket/{BookedTicketId}")]
        public async Task<IResult> GetBookedTickets([FromRoute] int BookedTicketId)
        {
            var result = await _mediator.Send(new BookedTicketQuery(BookedTicketId));
            return result;
        }

        [HttpGet("get-bookings")]
        public async Task<IResult> GetAllBookings()
        {
            var result = await _mediator.Send(new GetBookingsQuery());
            return result;
        }

        // POST api/<BookedTicketController>
        [HttpPost("book-ticket")]
        public async Task<IResult> CreateBookedTicket([FromBody] PostBookedTicketCommand command)
        {
            var result = await _mediator.Send(command);
            return result;
        }

        // PUT api/<BookedTicketController>/5
        [HttpPut("edit-booked-ticket/{BookedTicketId}")]
        public async Task<IResult> PutBookedTicket([FromRoute] int BookedTicketId, [FromBody] List<PutTicketRequestItem> items)
        {
            var result = await _mediator.Send(new PutBookedTicketCommand(BookedTicketId, items));
            return result;
        }

        // DELETE api/<BookedTicketController>/5
        [HttpDelete("revoke-ticket/{BookedTicketId}/{TicketCode}/{Qty}")]
        public async Task<IResult> RevokeBookedTicket([FromRoute] int BookedTicketId, [FromRoute] string TicketCode, [FromRoute] int Qty)
        {
            var result = await _mediator.Send(new DeleteBookedTicketCommand(BookedTicketId, TicketCode, Qty));
            return result;
        }
    }
}
