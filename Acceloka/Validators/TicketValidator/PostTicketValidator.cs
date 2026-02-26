using Acceloka.Commands.Ticket;
using FluentValidation;

namespace Acceloka.Validators.TicketValidator
{
    public class PostTicketValidator : AbstractValidator<PostTicketCommand>
    {
        public PostTicketValidator()
        {
            RuleFor(x => x.Tickets)
                .NotEmpty().WithMessage("At least one ticket is required.")
                .Must(tickets => tickets.Any()).WithMessage("At least one ticket is required.");

            RuleForEach(x => x.Tickets).ChildRules(ticket =>
            {
                ticket.RuleFor(t => t.Code)
                    .NotEmpty().WithMessage("Ticket code is required.")
                    .MaximumLength(10).WithMessage("Ticket code must not exceed 10 characters.");
                ticket.RuleFor(t => t.Name)
                    .NotEmpty().WithMessage("Ticket name is required.")
                    .MaximumLength(50).WithMessage("Ticket name must not exceed 50 characters.");
                ticket.RuleFor(t => t.CategoryName)
                    .NotEmpty().WithMessage("Category name is required.")
                    .MaximumLength(30).WithMessage("Category name must not exceed 30 characters.");
                ticket.RuleFor(t => t.EventDate)
                    .NotEmpty().WithMessage("Event Date name is required.")
                    .GreaterThan(DateTime.Now).WithMessage("Event date must be in the future.");
                ticket.RuleFor(t => t.Price)
                    .NotEmpty().WithMessage("Price is required.")
                    .GreaterThanOrEqualTo(0).WithMessage("Price must be a non-negative value.");
                ticket.RuleFor(t => t.Quota)
                    .NotEmpty().WithMessage("Quota is required.")
                    .GreaterThanOrEqualTo(0).WithMessage("Quota must be a non-negative integer.");
            });
        }
    }
}
