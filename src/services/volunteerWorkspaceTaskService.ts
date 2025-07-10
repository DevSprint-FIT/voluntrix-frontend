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

// New interfaces for the tables
export interface ToDoTask {
  taskId: string;
  description: string;
  taskDifficulty: "EASY" | "MEDIUM" | "HARD" | "EXTREME";
  dueDate: string;
}

export interface TaskInReview {
  taskId: string;
  description: string;
  taskDifficulty: "EASY" | "MEDIUM" | "HARD" | "EXTREME";
  taskSubmittedDate: string;
  resourceUrl: string;
}

export interface CompletedTask {
  taskId: string;
  description: string;
  taskDifficulty: "EASY" | "MEDIUM" | "HARD" | "EXTREME";
  taskSubmittedDate: string;
  taskReviewedDate: string;
  taskRewardPoints: number;
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

  // New methods for the tables
  static async getToDoTasks(): Promise<ToDoTask[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return [
      {
        taskId: "1",
        description: "Set up registration booth for event volunteers",
        taskDifficulty: "MEDIUM",
        dueDate: "2025-07-20",
      },
      {
        taskId: "2",
        description: "Prepare welcome packets and orientation materials",
        taskDifficulty: "EASY",
        dueDate: "2025-07-22",
      },
      {
        taskId: "3",
        description: "Coordinate with catering team for meal arrangements",
        taskDifficulty: "HARD",
        dueDate: "2025-07-25",
      },
      {
        taskId: "4",
        description:
          "Organize complex multi-day event logistics and emergency protocols",
        taskDifficulty: "EXTREME",
        dueDate: "2025-07-30",
      },
    ];
  }

  static async getTasksInReview(): Promise<TaskInReview[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return [
      {
        taskId: "1",
        description: "Design event promotional materials",
        taskDifficulty: "MEDIUM",
        taskSubmittedDate: "2025-07-15",
        resourceUrl: "https://drive.google.com/file/example1",
      },
      {
        taskId: "2",
        description: "Create volunteer training presentation",
        taskDifficulty: "HARD",
        taskSubmittedDate: "2025-07-16",
        resourceUrl: "https://docs.google.com/presentation/example2",
      },
      {
        taskId: "3",
        description: "Develop comprehensive crisis management system",
        taskDifficulty: "EXTREME",
        taskSubmittedDate: "2025-07-14",
        resourceUrl: "https://github.com/example/crisis-management",
      },
    ];
  }

  static async getCompletedTasks(): Promise<CompletedTask[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return [
      {
        taskId: "1",
        description: "Organize volunteer database and contact information",
        taskDifficulty: "EASY",
        taskSubmittedDate: "2025-07-10",
        taskReviewedDate: "2025-07-12",
        taskRewardPoints: 50,
      },
      {
        taskId: "2",
        description: "Conduct venue safety inspection and report",
        taskDifficulty: "MEDIUM",
        taskSubmittedDate: "2025-07-11",
        taskReviewedDate: "2025-07-13",
        taskRewardPoints: 75,
      },
      {
        taskId: "3",
        description: "Develop emergency response protocol",
        taskDifficulty: "HARD",
        taskSubmittedDate: "2025-07-08",
        taskReviewedDate: "2025-07-10",
        taskRewardPoints: 100,
      },
      {
        taskId: "4",
        description: "Design and implement full event management system",
        taskDifficulty: "EXTREME",
        taskSubmittedDate: "2025-07-05",
        taskReviewedDate: "2025-07-07",
        taskRewardPoints: 150,
      },
    ];
  }
}
