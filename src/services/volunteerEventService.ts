import authService from "@/services/authService";

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
};

export type EventType = "ONLINE" | "ONSITE";
export type ContributionArea =
  | "DESIGN"
  | "EDITORIAL"
  | "LOGISTICS"
  | "PROGRAMMING";

export type ActiveEvent = {
  eventId: number;
  eventName: string;
  startDate: number[]; // [year, month, day]
  endDate: number[]; // [year, month, day]
  location: string;
};

export type CompletedEvent = {
  eventName: string;
  startDate: number[]; // [year, month, day]
  endDate: number[]; // [year, month, day]
  eventType: EventType;
  contributionArea: ContributionArea;
};

export type AppliedEvent = {
  applicationId: number; // Added this field for deletion
  eventName: string;
  eventType: EventType;
  contributionArea: ContributionArea;
};

// Fetch active events for authenticated volunteer
export const getVolunteerActiveEvents = async (): Promise<ActiveEvent[]> => {
  try {
    const response = await fetch(
      `${getBaseUrl()}/api/participations/volunteers/active-events`,
      {
        method: "GET",
        headers: authService.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch active events: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as ActiveEvent[];
  } catch (error) {
    console.error("Error fetching volunteer active events:", error);
    throw error;
  }
};

// Fetch completed events for authenticated volunteer
export const getVolunteerCompletedEvents = async (): Promise<
  CompletedEvent[]
> => {
  try {
    const response = await fetch(
      `${getBaseUrl()}/api/participations/volunteers/completed-events`,
      {
        method: "GET",
        headers: authService.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch completed events: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as CompletedEvent[];
  } catch (error) {
    console.error("Error fetching volunteer completed events:", error);
    throw error;
  }
};

// Fetch applied events for authenticated volunteer
export const getVolunteerAppliedEvents = async (): Promise<AppliedEvent[]> => {
  try {
    const response = await fetch(
      `${getBaseUrl()}/api/participations/volunteers/applied-events`,
      {
        method: "GET",
        headers: authService.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch applied events: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as AppliedEvent[];
  } catch (error) {
    console.error("Error fetching volunteer applied events:", error);
    throw error;
  }
};

// Delete an event application using JWT authentication
export const deleteEventApplication = async (
  eventApplicationId: number
): Promise<void> => {
  try {
    const response = await fetch(
      `${getBaseUrl()}/api/event-applications/${eventApplicationId}`,
      {
        method: "DELETE",
        headers: authService.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to cancel application: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error cancelling event application:", error);
    throw error;
  }
};
