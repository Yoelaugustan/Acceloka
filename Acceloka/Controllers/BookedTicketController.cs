using Acceloka.Commands;
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
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<BookedTicketController>
        [HttpPost("book-ticket")]
        public async Task<IResult> CreateBookedTicket([FromBody] BookedTicketCommand command)
        {
            var result = await _mediator.Send(command);
            return result;
        }

        // PUT api/<BookedTicketController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<BookedTicketController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
