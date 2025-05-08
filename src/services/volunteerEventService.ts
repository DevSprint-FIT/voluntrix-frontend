export type EventType = "ONLINE" | "ONSITE";
export type ContributionArea =
  | "DESIGN"
  | "EDITORIAL"
  | "LOGISTICS"
  | "PROGRAMMING";

export type ActiveEvent = {
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
  eventName: string;
  eventType: EventType;
  contributionArea: ContributionArea;
};

// Fetch active events for a volunteer
export const getVolunteerActiveEvents = async (
  volunteerId: number
): Promise<ActiveEvent[]> => {
  try {
    const url = `http://localhost:8080/api/public/participations/volunteers/${volunteerId}/active-events`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch active events: ${response.statusText}`);
    }

    const data = await response.json();
    return data as ActiveEvent[];
  } catch (error) {
    console.error("Error fetching volunteer active events:", error);
    throw error;
  }
};

// Fetch completed events for a volunteer
export const getVolunteerCompletedEvents = async (
  volunteerId: number
): Promise<CompletedEvent[]> => {
  try {
    const url = `http://localhost:8080/api/public/participations/volunteers/${volunteerId}/completed-events`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch completed events: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as CompletedEvent[];
  } catch (error) {
    console.error("Error fetching volunteer completed events:", error);
    throw error;
  }
};

// Fetch applied events for a volunteer
export const getVolunteerAppliedEvents = async (
  volunteerId: number
): Promise<AppliedEvent[]> => {
  try {
    const url = `http://localhost:8080/api/public/participations/volunteers/${volunteerId}/applied-events`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch applied events: ${response.statusText}`);
    }

    const data = await response.json();
    return data as AppliedEvent[];
  } catch (error) {
    console.error("Error fetching volunteer applied events:", error);
    throw error;
  }
};
