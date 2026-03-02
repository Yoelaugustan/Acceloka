using Acceloka.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Acceloka.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(AccelokaDbContext context)
        {
            // 1. Add Categories if empty
            if (!await context.Categories.AnyAsync())
            {
                var categories = new List<Category>
                {
                    new Category { CategoryName = "Music" },
                    new Category { CategoryName = "Sports" },
                    new Category { CategoryName = "Theater" },
                    new Category { CategoryName = "Workshop" }
                };
                context.Categories.AddRange(categories);
                await context.SaveChangesAsync();
            }

            // 2. Add a Default User if empty
            if (!await context.Users.AnyAsync())
            {
                var defaultUser = new User
                {
                    Username = "admin",
                    Email = "admin@acceloka.com",
                    PasswordHash = HashPassword("Password123!"),
                    CreatedAt = DateTime.UtcNow
                };
                context.Users.Add(defaultUser);
                await context.SaveChangesAsync();
            }

            // 3. Add Tickets if empty
            if (!await context.Tickets.AnyAsync())
            {
                var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Username == "admin");
                
                if (adminUser != null)
                {
                    var tickets = new List<Ticket>
                    {
                        new Ticket
                        {
                            UserId = adminUser.UserId,
                            TicketCode = "M001",
                            TicketName = "Summer Music Festival",
                            CategoryName = "Music",
                            EventDate = DateTime.Now.AddMonths(1),
                            Price = 150000,
                            Quota = 100
                        },
                        new Ticket
                        {
                            UserId = adminUser.UserId,
                            TicketCode = "S001",
                            TicketName = "Championship Final",
                            CategoryName = "Sports",
                            EventDate = DateTime.Now.AddMonths(2),
                            Price = 250000,
                            Quota = 50
                        },
                        new Ticket
                        {
                            UserId = adminUser.UserId,
                            TicketCode = "T001",
                            TicketName = "Phantom of the Opera",
                            CategoryName = "Theater",
                            EventDate = DateTime.Now.AddMonths(3),
                            Price = 300000,
                            Quota = 30
                        }
                    };
                    context.Tickets.AddRange(tickets);
                    await context.SaveChangesAsync();
                }
            }
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
