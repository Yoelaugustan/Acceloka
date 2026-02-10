using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.Entities;

public partial class AccelokaDbContext : DbContext
{
    public AccelokaDbContext()
    {
    }

    public AccelokaDbContext(DbContextOptions<AccelokaDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BookedTicket> BookedTickets { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Ticket> Tickets { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=localhost;Initial Catalog=AccelokaDb;User id=sa;Pwd=HelloWorld123!;Encrypt=false");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BookedTicket>(entity =>
        {
            entity.HasKey(e => e.BookedTicketId).HasName("PK__BookedTi__9110472FE6053F8C");

            entity.HasOne(d => d.Ticket).WithMany(p => p.BookedTickets)
                .HasForeignKey(d => d.TicketId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BookedTickets_Tickets");
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
            entity.HasKey(e => e.TicketId).HasName("PK__Tickets__712CC607B5358F7C");

            entity.HasIndex(e => e.TicketCode, "UQ__Tickets__598CF7A315C8FBED").IsUnique();

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
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
