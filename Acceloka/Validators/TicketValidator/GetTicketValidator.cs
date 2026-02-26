using Acceloka.Commands;
using Acceloka.Queries;
using FluentValidation;

namespace Acceloka.Validators.TicketValidator
{
    public class GetTicketValidator : AbstractValidator<TicketsQuery>
    {
        public GetTicketValidator()
        {
            RuleFor(x => x.categoryName)
                .MaximumLength(50).WithMessage("Category name must not exceed 50 characters.");
            RuleFor(x => x.ticketCode)
                .MaximumLength(10).WithMessage("Ticket code must not exceed 10 characters.");
            RuleFor(x => x.ticketName)
                .MaximumLength(30).WithMessage("Ticket name must not exceed 30 characters.");
            RuleFor(x => x.maxPrice)
                .GreaterThanOrEqualTo(0).WithMessage("Maximum Price must be a non-negative value.");
            RuleFor(x => x.maxEventDate)
                .GreaterThanOrEqualTo(x => x.minEventDate)
                .When(x => x.minEventDate.HasValue && x.maxEventDate.HasValue).WithMessage("End of the Event Date must not be less than Start of the Event Date");
            RuleFor(x => x.orderBy)
                .Must(value => new[] { "ticketcode", "categoryname", "ticketname", "price", "eventdate" }.Contains(value.ToLower()))
                .When(x => !string.IsNullOrEmpty(x.orderBy))
                .WithMessage("Column sorting isn't valid.");

            RuleFor(x => x.orderState)
                .Must(value => new[] { "asc", "desc" }.Contains(value.ToLower()))
                .When(x => !string.IsNullOrEmpty(x.orderState))
                .WithMessage("Order state must be 'asc' or 'desc'.");
        }
    }
}
