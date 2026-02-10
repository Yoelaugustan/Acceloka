using Acceloka.Commands;
using Acceloka.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Acceloka.Controllers
{
    [Route("api/v1/category")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CategoryController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/<CategoryController>
        [HttpGet]
        public async Task<IResult> GetCategories()
        {
            var result = await _mediator.Send(new CategoriesQuery());
            return result;  
        }

        // POST api/<CategoryController>
        [HttpPost]
        public async Task<IResult> CreateCategory([FromBody] CategoryCommand command)
        {
            var result = await _mediator.Send(command);
            return result;
        }
    }
}
