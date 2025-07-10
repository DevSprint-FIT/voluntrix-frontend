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
  id: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXTREME";
  dueDate: string;
}

export interface TaskInReview {
  id: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXTREME";
  submittedDate: string;
  resourceUrl: string;
}

export interface CompletedTask {
  id: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXTREME";
  submittedDate: string;
  reviewedDate: string;
  rewardPoints: number;
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
        id: "1",
        description: "Set up registration booth for event volunteers",
        difficulty: "MEDIUM",
        dueDate: "2025-07-20",
      },
      {
        id: "2",
        description: "Prepare welcome packets and orientation materials",
        difficulty: "EASY",
        dueDate: "2025-07-22",
      },
      {
        id: "3",
        description: "Coordinate with catering team for meal arrangements",
        difficulty: "HARD",
        dueDate: "2025-07-25",
      },
      {
        id: "4",
        description: "Organize complex multi-day event logistics and emergency protocols",
        difficulty: "EXTREME",
        dueDate: "2025-07-30",
      },
    ];
  }

  static async getTasksInReview(): Promise<TaskInReview[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    return [
      {
        id: "1",
        description: "Design event promotional materials",
        difficulty: "MEDIUM",
        submittedDate: "2025-07-15",
        resourceUrl: "https://drive.google.com/file/example1",
      },
      {
        id: "2",
        description: "Create volunteer training presentation",
        difficulty: "HARD",
        submittedDate: "2025-07-16",
        resourceUrl: "https://docs.google.com/presentation/example2",
      },
      {
        id: "3",
        description: "Develop comprehensive crisis management system",
        difficulty: "EXTREME",
        submittedDate: "2025-07-14",
        resourceUrl: "https://github.com/example/crisis-management",
      },
    ];
  }

  static async getCompletedTasks(): Promise<CompletedTask[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    return [
      {
        id: "1",
        description: "Organize volunteer database and contact information",
        difficulty: "EASY",
        submittedDate: "2025-07-10",
        reviewedDate: "2025-07-12",
        rewardPoints: 50,
      },
      {
        id: "2",
        description: "Conduct venue safety inspection and report",
        difficulty: "MEDIUM",
        submittedDate: "2025-07-11",
        reviewedDate: "2025-07-13",
        rewardPoints: 75,
      },
      {
        id: "3",
        description: "Develop emergency response protocol",
        difficulty: "HARD",
        submittedDate: "2025-07-08",
        reviewedDate: "2025-07-10",
        rewardPoints: 100,
      },
      {
        id: "4",
        description: "Design and implement full event management system",
        difficulty: "EXTREME",
        submittedDate: "2025-07-05",
        reviewedDate: "2025-07-07",
        rewardPoints: 150,
      },
    ];
  }
}
