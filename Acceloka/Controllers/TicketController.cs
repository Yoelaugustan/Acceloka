using Acceloka.Commands.Category;
using Acceloka.Commands.Ticket;
using Acceloka.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Acceloka.Controllers
{
    [Route("api/v1/")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly IMediator _mediator;
        public TicketController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/<TicketController>
        [HttpGet("get-available-ticket")]
        public async Task<IResult> GetTickets([FromQuery] TicketsQuery query)
        {
            var result = await _mediator.Send(query);
            return result;
        }

        // POST api/<TicketController>
        [HttpPost("insert-tickets")]
        public async Task<IResult> CreateTicket([FromBody] PostTicketCommand command)
        {
            var result = await _mediator.Send(command);
            return result;
        }

        // DELETE api/<TicketController>
        [HttpDelete("delete-ticket/{TicketCode}")]
        public async Task<IResult> DeleteCategory([FromRoute] string TicketCode)
        {
            var result = await _mediator.Send(new DeleteTicketCommand(TicketCode));
            return result;
        }
    }
}
