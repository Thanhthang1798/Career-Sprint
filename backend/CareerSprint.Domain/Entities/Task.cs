using System;

namespace CareerSprint.Domain.Entities
{
    public class Task
    {
        public Guid Id { get; set; }
        public Guid SprintDayId { get; set; }
        public Guid SkillId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Target { get; set; } = string.Empty;
        public int EstimatedMinutes { get; set; }
        public int BaseXp { get; set; }
        public int SortOrder { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public SprintDay? SprintDay { get; set; }
        public Skill? Skill { get; set; }
    }
}
