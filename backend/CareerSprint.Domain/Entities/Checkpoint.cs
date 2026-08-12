using System;

namespace CareerSprint.Domain.Entities
{
    public class Checkpoint
    {
        public Guid Id { get; set; }
        public Guid SprintWeekId { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int XpReward { get; set; }
        public int SortOrder { get; set; }

        public SprintWeek? SprintWeek { get; set; }
    }
}
