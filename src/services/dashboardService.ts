

export interface FollowersData {
  month: string;
  count: number;
}

export interface InstituteDistribution {
  [institute: string]: number;
}



export async function getFollowersStatsByOrganizationId(orgId: number, year: number): Promise<FollowersData[]> {
  const res = await fetch(`http://localhost:8080/api/public/follow/stats/${orgId}?year=${year}`);

  if (!res.ok) {
    throw new Error("Failed to fetch followers stats");
  }

  return res.json();
}

export async function getInstituteDistributionByOrganizationId(organizationId: number): Promise<InstituteDistribution> {
  const response = await fetch(`http://localhost:8080/api/public/follow/institute-distribution/${organizationId}`);

  if (!response.ok) throw new Error("Failed to fetch institute distribution");
  return await response.json();
}

export async function getEventDataForOrganization(organizationId: number): Promise<{
  eventCount: number;
  eventDates: Date[];
}> {
  try {
    // Fetch all events from your existing endpoint
    const response = await fetch(`http://localhost:8080/api/public/events`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    
    const allEvents = await response.json();
    
    // Filter events for the specific organization
    const organizationEvents = allEvents.filter((event: any) => 
      event.organizationId === organizationId
    );
    
    // Extract start dates and convert to Date objects
    const eventDates = organizationEvents
      .map((event: any) => new Date(event.eventStartDate))
      .filter((date: Date) => !isNaN(date.getTime()));
    
    return {
      eventCount: organizationEvents.length,
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