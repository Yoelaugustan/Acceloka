using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.Entities;

public partial class AccelokaDbContext : DbContext
{
    public AccelokaDbContext(DbContextOptions<AccelokaDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BookedTicket> BookedTickets { get; set; }

    public virtual DbSet<Booking> Bookings { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Ticket> Tickets { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer("Server=localhost;Initial Catalog=AccelokaDb;User id=sa;Pwd=HelloWorld123!;Encrypt=false");
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BookedTicket>(entity =>
        {
            entity.HasKey(e => e.BookedTicketDetailId).HasName("PK__BookedTi__3C836D93E20E59FF");

            entity.Property(e => e.TicketCode)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.BookedTicketNavigation).WithMany(p => p.BookedTickets)
                .HasForeignKey(d => d.BookedTicketId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BookedTickets_Bookings");

            entity.HasOne(d => d.TicketCodeNavigation).WithMany(p => p.BookedTickets)
                .HasPrincipalKey(p => p.TicketCode)
                .HasForeignKey(d => d.TicketCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BookedTickets_Tickets");
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.BookedTicketId).HasName("PK__Bookings__9110472F689475A7");

            entity.Property(e => e.BookingDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.User).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Bookings_Users");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryName).HasName("PK__Categori__8517B2E1ADD40D43");

            entity.Property(e => e.CategoryName)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.HasKey(e => e.TicketId).HasName("PK__Tickets__712CC6077AEC0702");

            entity.HasIndex(e => e.TicketCode, "UQ__Tickets__598CF7A3153E39BA").IsUnique();

            entity.Property(e => e.CategoryName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.EventDate).HasColumnType("datetime");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TicketCode)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TicketName)
                .HasMaxLength(150)
                .IsUnicode(false);

            entity.HasOne(d => d.CategoryNameNavigation).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.CategoryName)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Tickets_Categories");

            entity.HasOne(d => d.User).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Tickets_Users");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C17EDAB7D");

            entity.HasIndex(e => e.Username, "UQ__Users__536C85E4805A9DF3").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Users__A9D1053410264F19").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
