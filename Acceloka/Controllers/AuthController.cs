using Acceloka.Commands.Auth;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Acceloka.Controllers
{
    [ApiController]
    [Route("api/v1/")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("register")]
        public async Task<IResult> Register([FromBody] PostRegisterCommand command)
        {
            var result = await _mediator.Send(command);
            return result;
        }

        [HttpPost("login")]
        public async Task<IResult> Login([FromBody] PostLoginCommand command)
        {
            var result = await _mediator.Send(command);
            return result;
        }
    }
}
