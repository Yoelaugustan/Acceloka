using Acceloka.Queries;
using FluentValidation;

namespace Acceloka.Validators.BookedTicketValidator
{
    public class GetBookedTicketValidator : AbstractValidator<BookedTicketQuery>
    {
        public GetBookedTicketValidator()
        {
            RuleFor(x => x.BookedTicketId)
                .NotEmpty().WithMessage("Booked Ticket ID is required")
                .GreaterThan(0).WithMessage("Booked Ticket ID should be greater than 0");
        }
    }
}
