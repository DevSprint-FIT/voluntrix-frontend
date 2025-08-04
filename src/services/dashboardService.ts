import authService from "./authService";

export interface FollowersData {
  month: string;
  count: number;
}

export interface InstituteDistribution {
  [institute: string]: number;
}

export interface DonationData {
  month: string;
  amount: number;
  label: string;
}

export interface ThisMonthDonation {
  amount: number;
  currency?: string;
}

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
};

export async function getFollowersStats(year: number): Promise<FollowersData[]> {
  const baseUrl = getBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/api/follow/stats?year=${year}`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
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
  const baseUrl = getBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/api/follow/institute-distribution`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
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

export async function getDonationsStats(year: number): Promise<DonationData[]> {
  const baseUrl = getBaseUrl();

  try {
    // First, get the organization data to get the correct organization ID
    const orgResponse = await fetch(`${baseUrl}/api/organizations/me`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
    });

    if (!orgResponse.ok) {
      throw new Error(`Failed to fetch organization data: ${orgResponse.status} ${orgResponse.statusText}`);
    }

    const orgData = await orgResponse.json();
    const organizationId = orgData.data?.id;

    if (!organizationId) {
      throw new Error("Organization ID not found in organization data");
    }

    // Now fetch donations using the correct organization ID
    const response = await fetch(`${baseUrl}/api/analytics/organizations/${organizationId}/donations/monthly?year=${year}`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      console.warn(`Donations stats API returned ${response.status}: ${response.statusText}`);
      return [];
    }

    // Check if the response has content
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Donations stats API did not return JSON content');
      return [];
    }

    // Check if response body is empty
    const text = await response.text();
    if (!text || text.trim() === '') {
      console.warn('Donations stats API returned empty response');
      return [];
    }

    let result;
    try {
      result = JSON.parse(text);
    } catch (parseError) {
      console.warn('Failed to parse donations stats response as JSON:', parseError);
      return [];
    }

    const data = result.data || result;
    
    // Handle case where data is not an array
    if (!Array.isArray(data)) {
      console.warn('Donations stats API did not return array data:', data);
      return [];
    }
    
    // Transform the data to match the expected format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedData: DonationData[] = data.map((item: any) => ({
      month: item.month || item.monthName || item.name || '',
      amount: item.amount || item.totalAmount || item.value || 0,
      label: item.month || item.monthName || item.name || ''
    }));

    return formattedData;
  } catch (error) {
    console.error("Error fetching donations stats:", error);
    return [];
  }
}

export async function getThisMonthDonations(): Promise<ThisMonthDonation> {
  const baseUrl = getBaseUrl();

  try {
    // First, get the organization data to get the correct organization ID
    const orgResponse = await fetch(`${baseUrl}/api/organizations/me`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
    });

    if (!orgResponse.ok) {
      throw new Error(`Failed to fetch organization data: ${orgResponse.status} ${orgResponse.statusText}`);
    }

    const orgData = await orgResponse.json();
    const organizationId = orgData.data?.id;

    if (!organizationId) {
      throw new Error("Organization ID not found in organization data");
    }

    // Now fetch this month's donations using the correct organization ID
    const response = await fetch(`${baseUrl}/api/analytics/organizations/${organizationId}/donations/this-month`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      // If the response is not OK, log the status and return default values
      console.warn(`This month donations API returned ${response.status}: ${response.statusText}`);
      return {
        amount: 0,
        currency: 'LKR'
      };
    }

    // Check if the response has content
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('This month donations API did not return JSON content');
      return {
        amount: 0,
        currency: 'LKR'
      };
    }

    // Check if response body is empty
    const text = await response.text();
    if (!text || text.trim() === '') {
      console.warn('This month donations API returned empty response');
      return {
        amount: 0,
        currency: 'LKR'
      };
    }

    let result;
    try {
      result = JSON.parse(text);
    } catch (parseError) {
      console.warn('Failed to parse this month donations response as JSON:', parseError);
      return {
        amount: 0,
        currency: 'LKR'
      };
    }

    const data = result.data || result;
    
    return {
      amount: data.amount || data.totalAmount || data.value || 0,
      currency: data.currency || 'LKR'
    };
  } catch (error) {
    console.error("Error fetching this month donations:", error);
    // Return default values instead of throwing
    return {
      amount: 0,
      currency: 'LKR'
    };
  }
}

export async function getEventDataForOrganization(): Promise<{
  eventCount: number;
  eventDates: Date[];
}> {
  const baseUrl = getBaseUrl();

  try {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      throw new Error("User not found");
    }

    // First, get the organization data to get the correct organization ID
    const orgResponse = await fetch(`${baseUrl}/api/organizations/me`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
    });

    if (!orgResponse.ok) {
      throw new Error(`Failed to fetch organization data: ${orgResponse.status} ${orgResponse.statusText}`);
    }

    const orgData = await orgResponse.json();
    const organizationId = orgData.data?.id;

    if (!organizationId) {
      throw new Error("Organization ID not found in organization data");
    }

    // Now fetch events using the correct organization ID
    const response = await fetch(`${baseUrl}/api/event-invitations/organization/${organizationId}`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch organization events: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    const allInvitations = result.data || result;
    
    console.log("All invitations received:", allInvitations);
    
    // Filter only APPROVED events
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const approvedEvents = allInvitations.filter((invitation: any) => 
      invitation.applicationStatus === 'APPROVED'
    );
    
    console.log("Approved events:", approvedEvents);
    
    // Fetch event details for each approved invitation
    const eventDates: Date[] = [];
    
    for (const invitation of approvedEvents) {
      if (invitation.eventId) {
        try {
          // Fetch the actual event details using the eventId
          const eventResponse = await fetch(`${baseUrl}/api/events/${invitation.eventId}`, {
            method: "GET",
            headers: authService.getAuthHeaders(),
          });
          
          if (eventResponse.ok) {
            const eventResult = await eventResponse.json();
            const eventData = eventResult.data || eventResult;
            
            console.log(`Event ${invitation.eventId} data:`, eventData);
            
            const dateString = eventData.eventStartDate || eventData.startDate || eventData.start_date;
            
            if (dateString) {
              const date = new Date(dateString);
              if (!isNaN(date.getTime())) {
                eventDates.push(date);
                console.log(`Added event date: ${date.toDateString()}`);
              } else {
                console.warn(`Invalid date for event ${invitation.eventId}:`, dateString);
              }
            } else {
              console.warn(`No start date found for event ${invitation.eventId}:`, eventData);
            }
          } else {
            console.warn(`Failed to fetch event ${invitation.eventId}: ${eventResponse.status}`);
          }
        } catch (error) {
          console.error(`Error fetching event ${invitation.eventId}:`, error);
        }
      }
    }
    
    console.log("Final event dates:", eventDates);
    console.log(`Organization has ${approvedEvents.length} approved events out of ${allInvitations.length} total invitations`);
    
    return {
      eventCount: approvedEvents.length,
      eventDates: eventDates
    };
    
  } catch (error) {
    console.error("Error fetching organization event data:", error);
    return {
      eventCount: 0,
      eventDates: []
    };
  }
}

// Legacy functions for backward compatibility
export async function getFollowersStatsByOrganizationId(orgId: number, year: number): Promise<FollowersData[]> {
  console.warn("getFollowersStatsByOrganizationId is deprecated. Use getFollowersStats instead.");
  return getFollowersStats(year);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getInstituteDistributionByOrganizationId(organizationId: number): Promise<InstituteDistribution> {
  console.warn("getInstituteDistributionByOrganizationId is deprecated. Use getInstituteDistribution instead.");
  return getInstituteDistribution();
}