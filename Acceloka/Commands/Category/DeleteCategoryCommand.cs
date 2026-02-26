using MediatR;

namespace Acceloka.Commands.Category
{
    public record DeleteCategoryCommand(string CategoryName) : IRequest<IResult>;
}
    