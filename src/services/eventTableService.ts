import authService from "./authService";

export type EventStatus = "DRAFT" | "PENDING" | "ACTIVE" | "COMPLETE" | "DENIED";
export type ApplicationStatus = "APPROVED" | "REJECTED" | "PENDING";

export type Event = {
  eventId: number;
  eventTitle: string;
  eventStartDate: string;
  eventEndDate: string;
  eventLocation: string;
  eventStatus: EventStatus;
  volunteerCount: number;
  eventHostId: number;
  eventHost?: {
    volunteerId: number;
    fullName: string;
    profilePictureUrl: string | null;
  };
};

export type EventInvitation = {
  id: number;
  eventId: number;
  organizationId: number;
  applicationStatus: ApplicationStatus;
};

export interface EventStatusCounts {
  active: number;
  pending: number;
  completed: number;
}

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
};

// Get current organization ID
const getCurrentOrganizationId = async (): Promise<number> => {
  const baseUrl = getBaseUrl();
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
};

// Get all volunteers for host lookup
const getAllVolunteers = async (): Promise<Map<number, any>> => {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/public/volunteers/all`, {
    method: "GET",
    headers: authService.getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch volunteers: ${response.status}`);
  }

  const volunteers = await response.json();
  const volunteerMap = new Map();
  volunteers.forEach((volunteer: any) => {
    volunteerMap.set(volunteer.volunteerId, volunteer);
  });

  return volunteerMap;
};

// Get all events
const getAllEvents = async (): Promise<Event[]> => {
  const baseUrl = getBaseUrl();
  
  try {
    const response = await fetch(`${baseUrl}/api/events/all`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      // Fallback to public endpoint
      const publicResponse = await fetch(`${baseUrl}/api/public/events/all`, {
        method: "GET",
        headers: authService.getAuthHeaders(),
      });
      
      if (!publicResponse.ok) {
        throw new Error(`Failed to fetch events: ${publicResponse.status}`);
      }
      
      const publicEvents = await publicResponse.json();
      const events = publicEvents.data || publicEvents;
      
      // Debug: Log the first event to see its structure
      if (events.length > 0) {
        console.log('Sample event structure:', JSON.stringify(events[0], null, 2));
      }
      
      return Array.isArray(events) ? events : [];
    }

    const result = await response.json();
    const events = result.data || result;
    
    // Debug: Log the first event to see its structure
    if (events.length > 0) {
      console.log('Sample event structure:', JSON.stringify(events[0], null, 2));
    }
    
    return Array.isArray(events) ? events : [];
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

// Get event invitations for current organization
export const getEventInvitationsByOrganization = async (): Promise<EventInvitation[]> => {
  const orgId = await getCurrentOrganizationId();
  const baseUrl = getBaseUrl();
  
  const response = await fetch(`${baseUrl}/api/event-invitations/organization/${orgId}`, {
    method: "GET",
    headers: authService.getAuthHeaders(),
  });
  
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`Failed to fetch event invitations: ${response.status}`);
  }

  const result = await response.json();
  const invitations = result.data || result;
  return Array.isArray(invitations) ? invitations : [];
};

// Get events by status with event host information
export const getEventsByStatus = async (status?: EventStatus): Promise<Event[]> => {
  // Get all required data
  const [invitations, allEvents, volunteers] = await Promise.all([
    getEventInvitationsByOrganization(),
    getAllEvents(),
    getAllVolunteers()
  ]);

  if (invitations.length === 0) return [];

  // Create invitation lookup map
  const invitationMap = new Map();
  invitations.forEach(inv => {
    invitationMap.set(inv.eventId, inv);
  });

  // Filter and enrich events
  return allEvents
    .filter(event => {
      const invitation = invitationMap.get(event.eventId);
      if (!invitation) return false;

      if (status === "PENDING") {
        // Show event requests (PENDING application status)
        return invitation.applicationStatus === "PENDING";
      } else if (status === "ACTIVE") {
        // Show active events (ACTIVE event status + APPROVED invitation)
        return event.eventStatus === "ACTIVE" && invitation.applicationStatus === "APPROVED";
      } else if (status === "COMPLETE") {
        // Show completed events
        return event.eventStatus === "COMPLETE" && invitation.applicationStatus === "APPROVED";
      }
      
      return true; // Show all if no status filter
    })
    .map(event => {
      // Add event host information
      const volunteer = volunteers.get(event.eventHostId);
      console.log(`Looking for eventHostId: ${event.eventHostId}, found volunteer:`, volunteer);
      
      return {
        ...event,
        eventHost: volunteer ? {
          volunteerId: volunteer.volunteerId,
          fullName: volunteer.fullName,
          profilePictureUrl: volunteer.profilePictureUrl
        } : {
          volunteerId: event.eventHostId,
          fullName: "Unknown Host",
          profilePictureUrl: null
        }
      };
    });
};

// Get event status counts
export const getEventStatusCounts = async (): Promise<EventStatusCounts> => {
  const [pendingRequests, activeEvents, completedEvents] = await Promise.all([
    getEventsByStatus("PENDING"),
    getEventsByStatus("ACTIVE"), 
    getEventsByStatus("COMPLETE")
  ]);

  return {
    pending: pendingRequests.length,
    active: activeEvents.length,
    completed: completedEvents.length,
  };
};

// Update invitation and event status
const updateEventStatus = async (
  eventId: number, 
  invitationId: number, 
  applicationStatus: ApplicationStatus,
  eventStatus: EventStatus
): Promise<void> => {
  const baseUrl = getBaseUrl();
  const headers = authService.getAuthHeaders();
  const orgId = await getCurrentOrganizationId();

  // Update invitation status
  const invitationResponse = await fetch(`${baseUrl}/api/event-invitations/${invitationId}`, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      eventId,
      organizationId: orgId,
      applicationStatus
    }),
  });

  if (!invitationResponse.ok) {
    throw new Error(`Failed to update invitation: ${invitationResponse.status}`);
  }

  // Update event status
  const eventResponse = await fetch(`${baseUrl}/api/events/${eventId}/status`, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ eventStatus }),
  });

  if (!eventResponse.ok) {
    console.error(`Failed to update event status: ${eventResponse.status}`);
  }
};

// Approve event request
export const approveEventRequest = async (eventId: number, invitationId: number): Promise<void> => {
  await updateEventStatus(eventId, invitationId, "APPROVED", "ACTIVE");
};

// Reject event request
export const rejectEventRequest = async (eventId: number, invitationId: number): Promise<void> => {
  await updateEventStatus(eventId, invitationId, "REJECTED", "DENIED");
};