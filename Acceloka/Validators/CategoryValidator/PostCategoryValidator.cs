using Acceloka.Commands.Category;
using FluentValidation;

namespace Acceloka.Validators.CategoryValidator
{
    public class PostCategoryValidator : AbstractValidator<PostCategoryCommand>
    {
        public PostCategoryValidator()
        {   
            RuleFor(c => c.Name)
                .NotEmpty().WithMessage("Category name is required.")
                .MaximumLength(30).WithMessage("Category name must not exceed 30 characters.");
        }
    }
}
