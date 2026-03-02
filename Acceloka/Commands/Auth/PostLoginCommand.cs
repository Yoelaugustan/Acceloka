using MediatR;

namespace Acceloka.Commands.Auth
{
    public class PostLoginCommand : IRequest<IResult>
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
