using Acceloka.Commands.Auth;
using FluentValidation;

namespace Acceloka.Validators.AuthValidator
{
    public class PostLoginValidator : AbstractValidator<PostLoginCommand>
    {
        public PostLoginValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty();
            RuleFor(x => x.Password)
                .NotEmpty();
        }
    }
}
