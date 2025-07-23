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
  // Enhanced error handling method
  private async handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        // Try to get error details from response body
        const errorData = await response.text();
        if (errorData) {
          try {
            const parsedError = JSON.parse(errorData);
            errorMessage =
              parsedError.message || parsedError.error || errorMessage;
          } catch {
            // If not JSON, use the text as error message
            errorMessage = errorData;
          }
        }
      } catch {
        // If we can't read the response body, use the default message
      }

      throw new Error(errorMessage);
    }

    const text = await response.text();
    if (!text) {
      throw new Error("Empty response from server");
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Invalid JSON response from server");
    }
  }

  // Get task status counts for an event
  async getTaskStatusCounts(eventId: number): Promise<TaskStatusCount> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/tasks/event/${eventId}/status-count`
      );
      return await this.handleApiResponse<TaskStatusCount>(response);
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
      return await this.handleApiResponse<TaskDTO[]>(response);
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
      return await this.handleApiResponse<VolunteerEventParticipationDTO[]>(
        response
      );
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

      return await this.handleApiResponse<TaskDTO>(response);
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
      console.log("Updating task with data:", updateData); // Debug log

      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      return await this.handleApiResponse<TaskDTO>(response);
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  // Format current date-time for backend (UTC format)
  private getCurrentDateTime(): string {
    const now = new Date();
    // Format as yyyy-MM-ddTHH:mm:ss (without timezone info)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  // Approve task (change status from IN_PROGRESS to DONE)
  async approveTask(taskId: number): Promise<TaskDTO> {
    const updateData: TaskUpdateDTO = {
      taskStatus: "DONE",
      taskReviewedDate: this.getCurrentDateTime(),
    };

    console.log("Approving task with data:", updateData); // Debug log
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
      taskReviewedDate: this.getCurrentDateTime(),
    };

    console.log("Rejecting task with data:", updateData); // Debug log
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
