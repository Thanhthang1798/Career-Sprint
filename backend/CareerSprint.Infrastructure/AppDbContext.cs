using CareerSprint.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Task = CareerSprint.Domain.Entities.Task;

namespace CareerSprint.Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<SprintWeek> SprintWeeks { get; set; }
        public DbSet<SprintDay> SprintDays { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<TaskProgress> TaskProgresses { get; set; }
        public DbSet<DailyReview> DailyReviews { get; set; }
        public DbSet<Checkpoint> Checkpoints { get; set; }
        public DbSet<CheckpointProgress> CheckpointProgresses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Optional: additional configurations like string length, unique indexes, etc.
            // E.g. modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        }
    }
}
