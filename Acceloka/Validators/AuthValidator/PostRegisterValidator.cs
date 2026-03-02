using Acceloka.Commands.Auth;
using FluentValidation;

namespace Acceloka.Validators.AuthValidator
{
    public class PostRegisterValidator : AbstractValidator<PostRegisterCommand>
    {
        public PostRegisterValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty()
                .MaximumLength(50);
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress()
                .MaximumLength(100);
            RuleFor(x => x.Password)
                .NotEmpty()
                .MinimumLength(6);
        }
    }
}
