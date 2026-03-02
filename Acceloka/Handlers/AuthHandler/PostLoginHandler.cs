using Acceloka.Commands.Auth;
using Acceloka.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Acceloka.Handlers.AuthHandler
{
    public class PostLoginHandler : IRequestHandler<PostLoginCommand, IResult>
    {
        private readonly AccelokaDbContext _db;
        private readonly IValidator<PostLoginCommand> _validator;
        private readonly IConfiguration _config;

        public PostLoginHandler(AccelokaDbContext db, IValidator<PostLoginCommand> validator, IConfiguration config)
        {
            _db = db;
            _validator = validator;
            _config = config;
        }

        public async Task<IResult> Handle(PostLoginCommand request, CancellationToken ct)
        {
            var validationResult = await _validator.ValidateAsync(request, ct);
            if (!validationResult.IsValid)
                return Results.ValidationProblem(validationResult.ToDictionary());

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == request.Username, ct);

            if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
                return Results.Unauthorized();

            var token = GenerateJwtToken(user);
            return Results.Ok(new { token });
        }

        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            var hash = Convert.ToBase64String(bytes);
            return hash == storedHash;
        }
    }
}
