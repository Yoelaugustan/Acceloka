using Acceloka.Commands.Category;
using FluentValidation;

namespace Acceloka.Validators.CategoryValidator
{
    public class DeleteCategoryValidator : AbstractValidator<DeleteCategoryCommand>
    {
        public DeleteCategoryValidator()
        {
            RuleFor(c => c.CategoryName)
                .NotEmpty().WithMessage("Category name is required.")
                .MaximumLength(30).WithMessage("Category name must not exceed 30 characters.");
        }
    }
}
