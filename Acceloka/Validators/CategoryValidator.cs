using Acceloka.Commands;
using FluentValidation;

namespace Acceloka.Validators
{
    public class CategoryValidator : AbstractValidator<CategoryCommand>
    {
        public CategoryValidator()
        {   
            RuleFor(c => c.Name)
                .NotEmpty().WithMessage("Category name is required.")
                .MaximumLength(30).WithMessage("Category name must not exceed 30 characters.");
        }
    }
}
