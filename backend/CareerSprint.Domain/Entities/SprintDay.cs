using System;
using System.Collections.Generic;

namespace CareerSprint.Domain.Entities
{
    public class SprintDay
    {
        public Guid Id { get; set; }
        public Guid SprintWeekId { get; set; }
        public DateTime Date { get; set; }
        public int DayNumber { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Phase { get; set; } = string.Empty;

        public SprintWeek? SprintWeek { get; set; }
        public ICollection<Task> Tasks { get; set; } = new List<Task>();
    }
}
