
export interface EventStatusCounts {
  active: number;
  pending: number;
  completed: number;
}

// Fetch event counts for the authenticated organization
export const getEventStatusCounts = async (): Promise<EventStatusCounts> => {
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

  if (!token) {
    throw new Error("Authentication token not found. Please check your environment variables.");
  }

  try {
    
    const response = await fetch(`${baseUrl}/public/events/all`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Status ${response.status}: ${response.statusText}`);
      console.error("Response body:", errorText);
      throw new Error(`Failed to fetch event status counts: ${response.statusText}`);
    }

    const result = await response.json();
    const events = result.data || result;

    // Count events by status
    const counts = {
      active: 0,
      pending: 0,
      completed: 0,
    };

    if (Array.isArray(events)) {
      events.forEach((event: any) => {
        switch (event.eventStatus) {
          case 'ACTIVE':
            counts.active++;
            break;
          case 'PENDING':
            counts.pending++;
            break;
          case 'COMPLETE':
            counts.completed++;
            break;
        }
      });
    }

    return counts;
  } catch (error) {
    console.error("Error fetching event status counts:", error);
    throw error;
  }
};

// Legacy function for backward compatibility
export const getEventStatusCountsByOrgId = async (orgId: number): Promise<EventStatusCounts> => {
  console.warn("getEventStatusCountsByOrgId is deprecated. Use getEventStatusCounts instead.");
  return getEventStatusCounts();
};