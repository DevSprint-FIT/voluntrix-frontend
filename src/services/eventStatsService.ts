import authService from "./authService";

export interface EventStatusCounts {
  active: number;
  pending: number;
  completed: number;
}


const getCurrentOrganizationId = async (): Promise<number> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  
  try {
    const response = await fetch(`${baseUrl}/api/organizations/me`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get organization info');
    }
    
    const result = await response.json();
    const data = result.data || result;
    
    if (!data?.id) {
      throw new Error('Organization ID not found');
    }
    
    return data.id;
  } catch (error) {
    console.error('Error getting organization ID:', error);
    throw new Error('Please ensure you are logged in as an organization user.');
  }
};

// Fetch event counts for the authenticated organization
export const getEventStatusCounts = async (): Promise<EventStatusCounts> => {
  
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  try {
    // Get current organization ID
    const orgId = await getCurrentOrganizationId();
    console.log(` Getting event stats for organization ID: ${orgId}`);
    
    // Get event invitations for this organization
    const invitationsResponse = await fetch(`${baseUrl}/api/event-invitations/organization/${orgId}`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
    });
    
    if (!invitationsResponse.ok) {
      if (invitationsResponse.status === 404) {
        console.log("No invitations found for this organization");
        return { active: 0, pending: 0, completed: 0 }; // Return zeros if no invitations
      }
      throw new Error(`Failed to fetch event invitations: ${invitationsResponse.status}`);
    }

    const invitationsResult = await invitationsResponse.json();
    const invitations = invitationsResult.data || invitationsResult;
    
    if (!Array.isArray(invitations) || invitations.length === 0) {
      console.log("No invitations found (empty array)");
      return { active: 0, pending: 0, completed: 0 };
    }
    
    console.log(`Found ${invitations.length} invitations for organization ID: ${orgId}`);
    
    // Extract event IDs from invitations
    const eventIds = invitations.map(inv => inv.eventId);
    
    
    const eventsResponse = await fetch(`${baseUrl}/api/public/events/all`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
    });

    if (!eventsResponse.ok) {
      const errorText = await eventsResponse.text();
      console.error(`Status ${eventsResponse.status}: ${eventsResponse.statusText}`);
      console.error("Response body:", errorText);
      throw new Error(`Failed to fetch events: ${eventsResponse.statusText}`);
    }

    const eventsResult = await eventsResponse.json();
    const allEvents = eventsResult.data || eventsResult;
    
    // Create a mapping of invitations by event ID for quick lookup
    const invitationMap = new Map();
    invitations.forEach(inv => {
      invitationMap.set(inv.eventId, inv);
    });
    
    // Count events by status, but only if they're associated with this organization
    const counts = {
      active: 0,
      pending: 0,
      completed: 0,
    };

    if (Array.isArray(allEvents)) {
      allEvents.forEach((event: any) => {
        // Skip events not associated with this organization
        if (!eventIds.includes(event.eventId)) {
          return;
        }
        
        const invitation = invitationMap.get(event.eventId);
        
        // For pending count, only include events with PENDING invitation status
        if (invitation && invitation.applicationStatus === "PENDING") {
          counts.pending++;
        }
        // For active count, only include events with ACTIVE status and APPROVED invitation
        else if (event.eventStatus === 'ACTIVE' && invitation && invitation.applicationStatus === 'APPROVED') {
          counts.active++;
        }
        // For completed count, only include events with COMPLETE status and APPROVED invitation
        else if (event.eventStatus === 'COMPLETE' && invitation && invitation.applicationStatus === 'APPROVED') {
          counts.completed++;
        }
      });
    }
    
    console.log(`Event counts for organization ${orgId}:`, counts);

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