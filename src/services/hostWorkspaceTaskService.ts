// Task-related types based on backend DTOs
export interface TaskDTO {
  taskId: number;
  description: string;
  createdDate: string;
  updatedDate: string;
  dueDate: string;
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

export interface TaskStatusCount {
  IN_PROGRESS: number;
  DONE: number;
  TO_DO: number;
}

export interface TaskCreateDTO {
  description: string;
  dueDate: string; // yyyy-MM-dd format
  taskDifficulty: "EASY" | "MEDIUM" | "HARD" | "EXTREME";
  taskCategory: "DESIGN" | "EDITORIAL" | "LOGISTICS" | "PROGRAMMING";
  assigneeId: number;
  eventId: number;
}

export interface TaskUpdateDTO {
  description?: string;
  dueDate?: string; // yyyy-MM-dd format
  taskStatus?: "TO_DO" | "IN_PROGRESS" | "DONE";
  resourceUrl?: string;
  taskSubmittedDate?: string; // yyyy-MM-dd'T'HH:mm:ss format
  assigneeId?: number;
  taskRewardPoints?: number;
  taskReviewedDate?: string; // yyyy-MM-dd'T'HH:mm:ss format
}

export interface VolunteerEventParticipationDTO {
  participationId: number;
  volunteerId: number;
  volunteerUsername: string;
  eventId: number;
  areaOfContribution: "DESIGN" | "EDITORIAL" | "LOGISTICS" | "PROGRAMMING";
  eventRewardPoints: number;
  isInactive: boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/public";

class HostWorkspaceTaskService {
  // Get task status counts for an event
  async getTaskStatusCounts(eventId: number): Promise<TaskStatusCount> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/tasks/event/${eventId}/status-count`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch task status counts: ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching task status counts:", error);
      throw error;
    }
  }

  // Get tasks by event ID and status
  async getTasksByEventAndStatus(
    eventId: number,
    taskStatus: "TO_DO" | "IN_PROGRESS" | "DONE"
  ): Promise<TaskDTO[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/tasks/event/${eventId}?taskStatus=${taskStatus}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  // Get available volunteers for an event
  async getAvailableVolunteers(
    eventId: number
  ): Promise<VolunteerEventParticipationDTO[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/participations/event/${eventId}/available`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch available volunteers: ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching available volunteers:", error);
      throw error;
    }
  }

  // Create a new task
  async createTask(taskData: TaskCreateDTO): Promise<TaskDTO> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create task: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  // Update task (for approving/rejecting tasks)
  async updateTask(
    taskId: number,
    updateData: TaskUpdateDTO
  ): Promise<TaskDTO> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  // Approve task (change status from IN_PROGRESS to DONE)
  async approveTask(taskId: number): Promise<TaskDTO> {
    const updateData: TaskUpdateDTO = {
      taskStatus: "DONE",
      taskReviewedDate: new Date().toISOString(), // Current local time in ISO format
    };

    return this.updateTask(taskId, updateData);
  }

  // Reject task (change status from IN_PROGRESS to TO_DO with updated description and due date)
  async rejectTask(
    taskId: number,
    updatedDescription: string,
    updatedDueDate: string
  ): Promise<TaskDTO> {
    const updateData: TaskUpdateDTO = {
      taskStatus: "TO_DO",
      description: updatedDescription,
      dueDate: updatedDueDate,
      taskReviewedDate: new Date().toISOString(), // Current local time in ISO format
    };

    return this.updateTask(taskId, updateData);
  }

  // Filter volunteers by contribution area
  filterVolunteersByContributionArea(
    volunteers: VolunteerEventParticipationDTO[],
    contributionArea: "DESIGN" | "EDITORIAL" | "LOGISTICS" | "PROGRAMMING"
  ): VolunteerEventParticipationDTO[] {
    return volunteers.filter(
      (volunteer) =>
        volunteer.areaOfContribution === contributionArea &&
        !volunteer.isInactive
    );
  }

  // Format date to yyyy-MM-dd format
  formatDateForBackend(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  // Format date-time to yyyy-MM-dd'T'HH:mm:ss format
  formatDateTimeForBackend(date: Date): string {
    return date.toISOString().slice(0, 19);
  }
}

export const hostWorkspaceTaskService = new HostWorkspaceTaskService();
