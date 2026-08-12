using System;
using System.Collections.Generic;

namespace CareerSprint.Domain.Entities
{
    public class SprintWeek
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public int WeekNumber { get; set; }
        public string Title { get; set; } = string.Empty;
        public int Level { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public User? User { get; set; }
        public ICollection<SprintDay> Days { get; set; } = new List<SprintDay>();
        public ICollection<Checkpoint> Checkpoints { get; set; } = new List<Checkpoint>();
    }
}
