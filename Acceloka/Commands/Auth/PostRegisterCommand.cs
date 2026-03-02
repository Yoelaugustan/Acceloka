using MediatR;

namespace Acceloka.Commands.Auth
{
    public class PostRegisterCommand : IRequest<IResult>
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
