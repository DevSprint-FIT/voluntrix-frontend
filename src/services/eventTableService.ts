export type EventStatus =  "PENDING" | "ACTIVE" | "COMPLETE" ;

export type Event = {
  eventId: number;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventStatus: EventStatus;
};

//  Fetch events (optionally by status)
export const getEventsByOrgId = async (orgId: number, status?: EventStatus): Promise<Event[]> => {
  try {
    let url = `http://localhost:8080/api/public/organizations/${orgId}/events`;
    if (status) {
      url += `?status=${status}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as Event[];
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};




