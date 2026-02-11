using Acceloka.Commands.BookedTicket;
using FluentValidation;

namespace Acceloka.Validators.BookedTicketValidator
{
    public class PutBookedTicketValidator : AbstractValidator<PutBookedTicketCommand>
    {
        public PutBookedTicketValidator()
        {
            RuleFor(x => x.BookedTicketId)
                .NotEmpty().WithMessage("Booked Ticket ID is required")
                .GreaterThan(0).WithMessage("Booked Ticket ID should be greater than 0");
            RuleForEach(x => x.EditItem).ChildRules(items =>
            {
                items.RuleFor(x => x.TicketCode)
                    .NotEmpty().WithMessage("Ticket Code is required")
                    .MaximumLength(10).WithMessage("Ticket code must not exceed 10 characters.");
                items.RuleFor(x => x.Quantity)
                    .GreaterThan(0).WithMessage("Quantity should be greater than 0");
            });
        }
    }
}
