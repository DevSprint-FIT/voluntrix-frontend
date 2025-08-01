// Service for workspace task data with backend integration
import authService from "@/services/authService";

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
  taskCategory: "DESIGN" | "EDITORIAL" | "LOGISTICS" | "PROGRAM";
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

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
};

export const WorkspaceTaskService = {
  // Helper method to format date
  formatDate(dateString: string | null): string {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },

  // Helper method to convert backend task to frontend task
  convertToToDoTask(backendTask: BackendTaskDTO): ToDoTask {
    return {
      taskId: backendTask.taskId.toString(),
      description: backendTask.description,
      taskDifficulty: backendTask.taskDifficulty,
      dueDate: this.formatDate(backendTask.dueDate),
    };
  },

  convertToTaskInReview(backendTask: BackendTaskDTO): TaskInReview {
    return {
      taskId: backendTask.taskId.toString(),
      description: backendTask.description,
      taskDifficulty: backendTask.taskDifficulty,
      taskSubmittedDate: this.formatDate(backendTask.taskSubmittedDate),
      resourceUrl: backendTask.resourceUrl || "",
    };
  },

  convertToCompletedTask(backendTask: BackendTaskDTO): CompletedTask {
    return {
      taskId: backendTask.taskId.toString(),
      description: backendTask.description,
      taskDifficulty: backendTask.taskDifficulty,
      taskRewardPoints: backendTask.taskRewardPoints,
      resourceUrl: backendTask.resourceUrl || "",
    };
  },

  // Get task stats from backend
  async getTaskStats(eventId: number): Promise<TaskStats> {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/tasks/assignee/event/${eventId}/status-count`,
        {
          method: "GET",
          headers: authService.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch task stats: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        totalTasksDue: data.TO_DO || 0,
        totalTasksPendingReview: data.IN_PROGRESS || 0,
        totalTasksCompleted: data.DONE || 0,
      };
    } catch (error) {
      console.error("Error fetching task stats:", error);
      throw error;
    }
  },

  // Get TO_DO tasks from backend
  async getToDoTasks(eventId: number): Promise<ToDoTask[]> {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/tasks/assignee/event/${eventId}?taskStatus=TO_DO`,
        {
          method: "GET",
          headers: authService.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch TO_DO tasks: ${response.statusText}`);
      }

      const data: BackendTaskDTO[] = await response.json();
      return data.map((task) => this.convertToToDoTask(task));
    } catch (error) {
      console.error("Error fetching TO_DO tasks:", error);
      throw error;
    }
  },

  // Get IN_PROGRESS tasks from backend
  async getTasksInReview(eventId: number): Promise<TaskInReview[]> {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/tasks/assignee/event/${eventId}?taskStatus=IN_PROGRESS`,
        {
          method: "GET",
          headers: authService.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch IN_PROGRESS tasks: ${response.statusText}`
        );
      }

      const data: BackendTaskDTO[] = await response.json();
      return data.map((task) => this.convertToTaskInReview(task));
    } catch (error) {
      console.error("Error fetching IN_PROGRESS tasks:", error);
      throw error;
    }
  },

  // Get DONE tasks from backend
  async getCompletedTasks(eventId: number): Promise<CompletedTask[]> {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/tasks/assignee/event/${eventId}?taskStatus=DONE`,
        {
          method: "GET",
          headers: authService.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch DONE tasks: ${response.statusText}`);
      }

      const data: BackendTaskDTO[] = await response.json();
      return data.map((task) => this.convertToCompletedTask(task));
    } catch (error) {
      console.error("Error fetching DONE tasks:", error);
      throw error;
    }
  },

  // Submit a task with resource URL and change status to IN_PROGRESS
  async submitTask(taskId: string, resourceUrl: string): Promise<boolean> {
    try {
      // Use local time for taskSubmittedDate
      const now = new Date();
      const currentDateTime = `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}T${now
        .getHours()
        .toString()
        .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;

      const updateData: TaskUpdateDTO = {
        taskStatus: "IN_PROGRESS",
        resourceUrl: resourceUrl,
        taskSubmittedDate: currentDateTime,
      };

      const response = await fetch(`${getBaseUrl()}/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit task: ${response.statusText}`);
      }

      console.log(
        `Task ${taskId} submitted successfully with URL: ${resourceUrl}`
      );
      console.log(`Task status changed to IN_PROGRESS`);
      console.log(`Task submitted date: ${currentDateTime}`);

      return true;
    } catch (error) {
      console.error("Error submitting task:", error);
      throw error;
    }
  },
};
