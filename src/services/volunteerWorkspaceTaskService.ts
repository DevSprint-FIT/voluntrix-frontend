// Service for workspace task data with backend integration

export interface TaskStats {
  totalTasksDue: number;
  totalTasksPendingReview: number;
  totalTasksCompleted: number;
}

// Backend task response interface
export interface BackendTaskDTO {
  taskId: number;
  description: string;
  createdDate: string;
  updatedDate: string;
  dueDate: string | null;
  taskStatus: "TO_DO" | "IN_PROGRESS" | "DONE";
  taskDifficulty: "EASY" | "MEDIUM" | "HARD" | "EXTREME";
  taskCategory: "DESIGN" | "EDITORIAL" | "LOGISTICS" | "PROGRAMMING";
  resourceUrl: string | null;
  taskSubmittedDate: string | null;
  assigneeId: number;
  assigneeUsername: string;
  eventId: number;
  eventTitle: string;
  taskRewardPoints: number;
  taskReviewedDate: string | null;
}

// Frontend interfaces for the tables
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
  taskRewardPoints: number;
  resourceUrl: string;
}

// Task update interface for backend
export interface TaskUpdateDTO {
  description?: string;
  dueDate?: string;
  taskStatus?: "TO_DO" | "IN_PROGRESS" | "DONE";
  resourceUrl?: string;
  taskSubmittedDate?: string;
  assigneeId?: number;
  taskRewardPoints?: number;
  taskReviewedDate?: string;
}

export class WorkspaceTaskService {
  private static readonly BASE_URL = "http://localhost:8080/api/public/tasks";
  private static readonly VOLUNTEER_ID = 1; // Hardcoded for now
  private static readonly EVENT_ID = 1; // Hardcoded for now

  // Helper method to format date
  private static formatDate(dateString: string | null): string {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Helper method to convert backend task to frontend task
  private static convertToToDoTask(backendTask: BackendTaskDTO): ToDoTask {
    return {
      taskId: backendTask.taskId.toString(),
      description: backendTask.description,
      taskDifficulty: backendTask.taskDifficulty,
      dueDate: this.formatDate(backendTask.dueDate),
    };
  }

  private static convertToTaskInReview(backendTask: BackendTaskDTO): TaskInReview {
    return {
      taskId: backendTask.taskId.toString(),
      description: backendTask.description,
      taskDifficulty: backendTask.taskDifficulty,
      taskSubmittedDate: this.formatDate(backendTask.taskSubmittedDate),
      resourceUrl: backendTask.resourceUrl || "",
    };
  }

  private static convertToCompletedTask(backendTask: BackendTaskDTO): CompletedTask {
    return {
      taskId: backendTask.taskId.toString(),
      description: backendTask.description,
      taskDifficulty: backendTask.taskDifficulty,
      taskRewardPoints: backendTask.taskRewardPoints,
      resourceUrl: backendTask.resourceUrl || "",
    };
  }

  // Get task stats from backend
  static async getTaskStats(): Promise<TaskStats> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/assignee/${this.VOLUNTEER_ID}/event/${this.EVENT_ID}/status-count`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        totalTasksDue: data.TO_DO || 0,
        totalTasksPendingReview: data.IN_PROGRESS || 0,
        totalTasksCompleted: data.DONE || 0,
      };
    } catch (error) {
      console.error("Error fetching task stats:", error);
      // Return default values on error
      return {
        totalTasksDue: 0,
        totalTasksPendingReview: 0,
        totalTasksCompleted: 0,
      };
    }
  }

  // Get TO_DO tasks from backend
  static async getToDoTasks(): Promise<ToDoTask[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/assignee/${this.VOLUNTEER_ID}/event/${this.EVENT_ID}?taskStatus=TO_DO`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: BackendTaskDTO[] = await response.json();
      return data.map(task => this.convertToToDoTask(task));
    } catch (error) {
      console.error("Error fetching TO_DO tasks:", error);
      return [];
    }
  }

  // Get IN_PROGRESS tasks from backend
  static async getTasksInReview(): Promise<TaskInReview[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/assignee/${this.VOLUNTEER_ID}/event/${this.EVENT_ID}?taskStatus=IN_PROGRESS`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: BackendTaskDTO[] = await response.json();
      return data.map(task => this.convertToTaskInReview(task));
    } catch (error) {
      console.error("Error fetching IN_PROGRESS tasks:", error);
      return [];
    }
  }

  // Get DONE tasks from backend
  static async getCompletedTasks(): Promise<CompletedTask[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/assignee/${this.VOLUNTEER_ID}/event/${this.EVENT_ID}?taskStatus=DONE`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: BackendTaskDTO[] = await response.json();
      return data.map(task => this.convertToCompletedTask(task));
    } catch (error) {
      console.error("Error fetching DONE tasks:", error);
      return [];
    }
  }

  // Submit a task with resource URL and change status to IN_PROGRESS
  static async submitTask(
    taskId: string,
    resourceUrl: string
  ): Promise<boolean> {
    try {
      // Use local time for taskSubmittedDate
      const now = new Date();
      const currentDateTime = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}T${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;

      const updateData: TaskUpdateDTO = {
        taskStatus: "IN_PROGRESS",
        resourceUrl: resourceUrl,
        taskSubmittedDate: currentDateTime,
      };

      const response = await fetch(`${this.BASE_URL}/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`Task ${taskId} submitted successfully with URL: ${resourceUrl}`);
      console.log(`Task status changed to IN_PROGRESS`);
      console.log(`Task submitted date: ${currentDateTime}`);
      
      return true;
    } catch (error) {
      console.error("Error submitting task:", error);
      return false;
    }
  }
}
