export interface FollowersData {
  month: string;
  count: number;
}

export interface InstituteDistribution {
  [institute: string]: number;
}

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";
};

const getAuthHeaders = () => {
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  if (!token) {
    throw new Error("Authentication token not found. Please check your environment variables.");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export async function getFollowersStats(year: number): Promise<FollowersData[]> {
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  const baseUrl = getBaseUrl();

  if (!token) {
    throw new Error("Authentication token not found. Please check your environment variables.");
  }

  try {
    const response = await fetch(`${baseUrl}/follow/stats?year=${year}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch followers stats: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching followers stats:", error);
    throw error;
  }
}

export async function getInstituteDistribution(): Promise<InstituteDistribution> {
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  const baseUrl = getBaseUrl();

  if (!token) {
    throw new Error("Authentication token not found. Please check your environment variables.");
  }

  try {
    const response = await fetch(`${baseUrl}/follow/institute-distribution`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch institute distribution: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching institute distribution:", error);
    throw error;
  }
}

export async function getEventDataForOrganization(): Promise<{
  eventCount: number;
  eventDates: Date[];
}> {
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  const baseUrl = getBaseUrl();

  try {

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };


    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}/public/events/all`, {
      method: "GET",
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    const allEvents = result.data || result;
    
    // Extract start dates and convert to Date objects
    const eventDates = allEvents
      .map((event: any) => new Date(event.eventStartDate))
      .filter((date: Date) => !isNaN(date.getTime()));
    
    return {
      eventCount: allEvents.length,
      eventDates: eventDates
    };
    
  } catch (error) {
    console.error("Error fetching event data:", error);
    return {
      eventCount: 0,
      eventDates: []
    };
  }
}

// Legacy functions for backward compatibility (will be removed)
export async function getFollowersStatsByOrganizationId(orgId: number, year: number): Promise<FollowersData[]> {
  console.warn("getFollowersStatsByOrganizationId is deprecated. Use getFollowersStats instead.");
  return getFollowersStats(year);
}

export async function getInstituteDistributionByOrganizationId(organizationId: number): Promise<InstituteDistribution> {
  console.warn("getInstituteDistributionByOrganizationId is deprecated. Use getInstituteDistribution instead.");
  return getInstituteDistribution();
}