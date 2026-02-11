using Acceloka.Commands.Category;
using Acceloka.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Acceloka.Controllers
{
    [Route("api/v1/")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CategoryController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/<CategoryController>
        [HttpGet("get-categories")]
        public async Task<IResult> GetCategories()
        {
            var result = await _mediator.Send(new CategoriesQuery());
            return result;  
        }

        // POST api/<CategoryController>
        [HttpPost("insert-category")]
        public async Task<IResult> CreateCategory([FromBody] PostCategoryCommand command)
        {
            var result = await _mediator.Send(command);
            return result;
        }

        // DELETE api/<CategoryController>
        [HttpDelete("delete-category/{CategoryName}")]
        public async Task<IResult> DeleteCategory([FromRoute] string CategoryName)
        {
            var result = await _mediator.Send(new DeleteCategoryCommand(CategoryName));
            return result;
        }
    }
}
