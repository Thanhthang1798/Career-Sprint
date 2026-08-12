using System;

namespace CareerSprint.Domain.Entities
{
    public class CheckpointProgress
    {
        public Guid Id { get; set; }
        public Guid CheckpointId { get; set; }
        public Guid UserId { get; set; }
        public bool Completed { get; set; }
        public DateTime? CompletedAt { get; set; }

        public Checkpoint? Checkpoint { get; set; }
        public User? User { get; set; }
    }
}
