using System;

namespace CareerSprint.Domain.Entities
{
    public class TaskProgress
    {
        public Guid Id { get; set; }
        public Guid TaskId { get; set; }
        public Guid UserId { get; set; }
        public string Status { get; set; } = "NotStarted"; // NotStarted, InProgress, Done, Blocked, Skipped
        public DateTime? CompletedAt { get; set; }
        public string Evidence { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }

        public Task? Task { get; set; }
        public User? User { get; set; }
    }
}
