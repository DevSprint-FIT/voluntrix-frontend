export interface EventStatusCounts {
    active: number;
    pending: number;
    completed: number;
  }
  
// Fetch event counts (status counts)
export const getEventStatusCounts = async (orgId: number): Promise<EventStatusCounts> => {
  try {
    const url = `http://localhost:8080/api/public/organizations/${orgId}/events/status-count`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Status ${response.status}: ${response.statusText}`);
      console.error("Response body:", errorText);
      throw new Error(`Failed to fetch event status counts: ${response.statusText}`);
    }

    const rawData = await response.json();

  
    const mappedData: EventStatusCounts = {
    active: rawData.active ?? 0,
    pending: rawData.pending ?? 0,
    completed: rawData.completed ?? 0,
};

    return mappedData;
  } catch (error) {
    console.error("Error fetching event status counts:", error);
    throw error;
  }
};
  