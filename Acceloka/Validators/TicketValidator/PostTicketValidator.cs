using Acceloka.Commands.Ticket;
using FluentValidation;

namespace Acceloka.Validators.TicketValidator
{
    public class PostTicketValidator : AbstractValidator<PostTicketCommand>
    {
        public PostTicketValidator()
        {
            RuleFor(t => t.Code)
                .NotEmpty().WithMessage("Ticket code is required.")
                .MaximumLength(10).WithMessage("Ticket code must not exceed 10 characters.");
            RuleFor(t => t.Name)
                .NotEmpty().WithMessage("Ticket name is required.")
                .MaximumLength(30).WithMessage("Ticket name must not exceed 30 characters.");
            RuleFor(t => t.CategoryName)
                .NotEmpty().WithMessage("Category name is required.")
                .MaximumLength(30).WithMessage("Category name must not exceed 30 characters.");
            RuleFor(t => t.EventDate)
                .NotEmpty().WithMessage("Event Date name is required.")
                .GreaterThan(DateTime.Now).WithMessage("Event date must be in the future.");
            RuleFor(t => t.Price)
                .NotEmpty().WithMessage("Price is required.")
                .GreaterThanOrEqualTo(0).WithMessage("Price must be a non-negative value.");
            RuleFor(t => t.Quota)
                .NotEmpty().WithMessage("Quota is required.")
                .GreaterThanOrEqualTo(0).WithMessage("Quota must be a non-negative integer.");
        }
    }
}
