// Service for workspace task data
// This will be replaced with actual API calls later

export interface TaskStats {
  totalTasksDue: number;
  totalTasksPendingReview: number;
  totalTasksCompleted: number;
}

export interface TaskData {
  id: string;
  title: string;
  description: string;
  status: "due" | "pending_review" | "completed";
  dueDate: string;
  assignedTo: string;
  priority: "low" | "medium" | "high";
}

export class WorkspaceTaskService {
  // Dummy data for now - will be replaced with API calls
  static async getTaskStats(): Promise<TaskStats> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      totalTasksDue: 12,
      totalTasksPendingReview: 8,
      totalTasksCompleted: 45,
    };
  }

  static async getTasks(): Promise<TaskData[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
      {
        id: "1",
        title: "Set up registration booth",
        description: "Prepare and organize the registration area for the event",
        status: "due",
        dueDate: "2025-07-20",
        assignedTo: "John Doe",
        priority: "high",
      },
      {
        id: "2",
        title: "Prepare welcome packets",
        description: "Assemble welcome packets for new volunteers",
        status: "pending_review",
        dueDate: "2025-07-18",
        assignedTo: "Jane Smith",
        priority: "medium",
      },
      {
        id: "3",
        title: "Coordinate with catering",
        description: "Finalize catering arrangements for the event",
        status: "completed",
        dueDate: "2025-07-15",
        assignedTo: "Mike Johnson",
        priority: "high",
      },
    ];
  }
}
