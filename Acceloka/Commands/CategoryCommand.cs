using MediatR;

namespace Acceloka.Commands
{
    public class CategoryCommand : IRequest <IResult>
    {
        public string Name { get; set;  } = string.Empty;
    }
}
    