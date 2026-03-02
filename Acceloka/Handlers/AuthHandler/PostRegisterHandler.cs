using Acceloka.Commands.Auth;
using Acceloka.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Acceloka.Handlers.AuthHandler
{
    public class PostRegisterHandler : IRequestHandler<PostRegisterCommand, IResult>
    {
        private readonly AccelokaDbContext _db;
        private readonly IValidator<PostRegisterCommand> _validator;

        public PostRegisterHandler(AccelokaDbContext db, IValidator<PostRegisterCommand> validator)
        {
            _db = db;
            _validator = validator;
        }

        public async Task<IResult> Handle(PostRegisterCommand request, CancellationToken ct)
        {
            var validationResult = await _validator.ValidateAsync(request, ct);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            if (await _db.Users.AnyAsync(u => u.Username == request.Username, ct))
            {
                return Results.BadRequest("Username already exists.");
            }

            if (await _db.Users.AnyAsync(u => u.Email == request.Email, ct))
            {
                return Results.BadRequest("Email already exists.");
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync(ct);

            return Results.Ok("User registered successfully.");
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
