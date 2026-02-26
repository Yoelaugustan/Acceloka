using MediatR;

namespace Acceloka.Commands.Category
{
    public class PostCategoryCommand : IRequest <IResult>
    {
        public string Name { get; set;  } = string.Empty;
    }
}
    