using Acceloka.Commands.Ticket;
using FluentValidation;

namespace Acceloka.Validators.TicketValidator
{
    public class DeleteTicketValidator : AbstractValidator<DeleteTicketCommand>
    {
        public DeleteTicketValidator()
        {
            RuleFor(t => t.TicketCode)
                .NotEmpty().WithMessage("Ticket code is required.")
                .MaximumLength(10).WithMessage("Ticket code must not exceed 10 characters.");
        }
    }
}
