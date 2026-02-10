using Acceloka.Commands.BookedTicket;
using FluentValidation;

namespace Acceloka.Validators.BookedTicketValidator
{
    public class PostBookedTicketValidator : AbstractValidator<PostBookedTicketCommand>
    {
        public PostBookedTicketValidator() 
        {
            RuleFor(t => t.TicketCode)
                .NotEmpty().WithMessage("Ticket code is required.")
                .MaximumLength(10).WithMessage("Ticket code must not exceed 10 characters.");
            RuleFor(t => t.Quantity)
                .NotEmpty().WithMessage("Quantity is required.")
                .GreaterThan(0).WithMessage("Quantity must be greater than zero.");
        }
    }
}
