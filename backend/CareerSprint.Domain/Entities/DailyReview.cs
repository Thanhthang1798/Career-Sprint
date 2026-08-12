using System;

namespace CareerSprint.Domain.Entities
{
    public class DailyReview
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid SprintDayId { get; set; }
        public string Learned { get; set; } = string.Empty;
        public string Practiced { get; set; } = string.Empty;
        public string Unclear { get; set; } = string.Empty;
        public int Confidence { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public User? User { get; set; }
        public SprintDay? SprintDay { get; set; }
    }
}
