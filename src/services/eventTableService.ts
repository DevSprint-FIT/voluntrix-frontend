export type EventRequest = {
    eventTitle: string;
    eventDate: string;
    eventStatus: "PENDING" | "APPROVED" | "REJECTED";
  };
  
  
  export const getEventRequestsByOrgId = async (orgId: number): Promise<EventRequest[]> => {
    try {
      const response = await fetch(`http://localhost:8080/api/public/event-requests/${orgId}`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch event requests: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data as EventRequest[];
    } catch (error) {
      console.error("Error fetching event requests:", error);
      throw error;
    }
  };