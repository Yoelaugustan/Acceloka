using Acceloka.Commands.Category;
using Acceloka.Commands.Ticket;
using Acceloka.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

        // GET: api/<TicketController>
        [Authorize]
        [HttpGet("get-my-tickets")]
        public async Task<IResult> GetMyTickets([FromQuery] TicketsQuery query)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdStr, out var userId))
            {
                query.userId = userId;
            }

            var result = await _mediator.Send(query);
            return result;
        }

        // POST api/<TicketController>
        [Authorize]
        [HttpPost("insert-tickets")]
        public async Task<IResult> CreateTicket([FromBody] PostTicketCommand command)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdStr, out var userId))
            {
                command.UserId = userId;
            }
            
            var result = await _mediator.Send(command);
            return result;
        }

        // DELETE api/<TicketController>
        [Authorize]
        [HttpDelete("delete-ticket/{TicketCode}")]
        public async Task<IResult> DeleteCategory([FromRoute] string TicketCode)
        {
            var result = await _mediator.Send(new DeleteTicketCommand(TicketCode));
            return result;
        }
    }
}
