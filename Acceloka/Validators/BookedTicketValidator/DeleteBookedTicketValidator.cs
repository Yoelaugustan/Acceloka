using Acceloka.Commands.BookedTicket;
using FluentValidation;

namespace Acceloka.Validators.BookedTicketValidator
{
    public class DeleteBookedTicketValidator : AbstractValidator<DeleteBookedTicketCommand>
    {
        public DeleteBookedTicketValidator()
        {
            RuleFor(x => x.BookedTicketId)
            .NotEmpty().WithMessage("Booked Ticket ID is required")
            .GreaterThan(0).WithMessage("Booked Ticket Is must be greater than 0");

            RuleFor(x => x.TicketCode)
                .NotEmpty().WithMessage("Ticket Code is required")
                .MaximumLength(50).WithMessage("Ticket Code must not exceed 50 character");

            RuleFor(x => x.Qty)
                .NotEmpty().WithMessage("Quantity is required")
                .GreaterThan(0).WithMessage("Quantity must be greater than 0");
        }
    }
}
