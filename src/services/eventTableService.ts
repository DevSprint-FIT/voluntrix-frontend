
export type EventStatus = "DRAFT" | "PENDING" | "ACTIVE" | "COMPLETE" | "DENIED";

export type Event = {
  eventId: number;
  eventTitle: string;
  eventStartDate: string;
  eventEndDate: string;
  eventLocation: string;
  eventStatus: EventStatus;
  volunteerCount: number;
  eventHostId: number;
};


export type Volunteer = {
  volunteerId: number;
  userId: number;
  username: string;
  fullName: string;                    
  email: string;
  institute: string;
  instituteEmail: string;
  isAvailable: boolean;
  volunteerLevel: number;
  rewardPoints: number;
  isEventHost: boolean;
  joinedDate: string;
  about: string;
  phoneNumber: string;
  profilePictureUrl: string | null;
};

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


export const getEventsByStatus = async (status?: EventStatus): Promise<Event[]> => {
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  const baseUrl = getBaseUrl();

  if (!token) {
    throw new Error("Authentication token not found. Please check your environment variables.");
  }

  try {
    let url = `${baseUrl}/public/events/all`;
    
    console.log(` Making API request to: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    console.log(` Response status: ${response.status}`);
    console.log(` Response ok: ${response.ok}`);

    if (!response.ok) {
      if (response.status === 404) {
        console.log(` No events found with status ${status || 'any'} (404)`);
        return [];
      }
      
      let errorMessage = `Failed to fetch events: ${response.status} ${response.statusText}`;
      
      try {
        const errorData = await response.text();
        console.log(` Error response body:`, errorData);
        
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.message || parsedError.error || errorMessage;
        } catch (parseError) {
          if (errorData) {
            errorMessage = errorData;
          }
        }
      } catch (textError) {
        console.log(` Could not read error response body`);
      }

      if (response.status === 500) {
        throw new Error(`Server error: ${errorMessage}`);
      } else {
        throw new Error(errorMessage);
      }
    }

    const result = await response.json();
    const allEvents = result.data || result;
    
    console.log(` Successfully fetched ${allEvents?.length || 0} events`);
    
    // Filter by status if provided
    if (status && Array.isArray(allEvents)) {
      const filteredEvents = allEvents.filter((event: Event) => event.eventStatus === status);
      console.log(` Filtered to ${filteredEvents.length} events with status: ${status}`);
      return filteredEvents;
    }
    
    return Array.isArray(allEvents) ? allEvents : [];
  } catch (error) {
    console.error(" Error fetching events:", error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend server. Make sure the server is running.');
    }
    
    throw error;
  }
};

// Your existing updateEventStatus function (unchanged)
export const updateEventStatus = async (eventId: number, status: EventStatus): Promise<Event> => {
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  const baseUrl = getBaseUrl();

  if (!token) {
    throw new Error("Authentication token not found. Please check your environment variables.");
  }

  try {
    const url = `${baseUrl}/events/${eventId}`;
    
    console.log(`Making PATCH request to: ${url}`);
    console.log(`Request body:`, { eventStatus: status });
    
    const requestBody = {
      eventStatus: status
    };
    
    console.log(`Stringified body: ${JSON.stringify(requestBody)}`);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`Response status: ${response.status}`);
    console.log(`Response ok: ${response.ok}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response body:`, errorText);
      throw new Error(`Failed to update event status: ${response.status} ${response.statusText}`);
    }

    const responseText = await response.text();
    console.log('Raw response text:', responseText);
    
    if (!responseText || responseText.trim() === '') {
      console.log('Empty response - status update successful');
      return {
        eventId: eventId,
        eventStatus: status
      } as Event;
    }

    try {
      const result = JSON.parse(responseText);
      const updatedEvent = result.data || result;
      console.log('Updated event received:', updatedEvent);
      return updatedEvent as Event;
    } catch (parseError) {
      console.log('Response is not JSON, but status update was successful');
      return {
        eventId: eventId,
        eventStatus: status
      } as Event;
    }
  } catch (error) {
    console.error("Error updating event status:", error);
    throw error;
  }
};


export const getAllVolunteers = async (): Promise<Map<number, Volunteer>> => {
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  const baseUrl = getBaseUrl();

  if (!token) {
    throw new Error("Authentication token not found. Please check your environment variables.");
  }

  try {
    const url = `${baseUrl}/public/volunteers/all`;
    
    console.log(`Fetching volunteers from: ${url}`);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,  
        "Content-Type": "application/json",
      },
    });

    console.log(` Volunteers response status: ${response.status}`);
    console.log(` Volunteers response ok: ${response.ok}`);

    if (!response.ok) {
      let errorMessage = `Failed to fetch volunteers: ${response.status} ${response.statusText}`;
      
      try {
        const errorData = await response.text();
        console.log(` Volunteers error response body:`, errorData);
        
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.message || parsedError.error || errorMessage;
        } catch (parseError) {
          if (errorData) {
            errorMessage = errorData;
          }
        }
      } catch (textError) {
        console.log(` Could not read volunteers error response body`);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log(` Raw volunteer response:`, result);
    
    const volunteers: any[] = result.data || result;
    console.log(` Processing ${volunteers.length} volunteers`);
    
    // Create a map for quick lookup by volunteerId
    const volunteerMap = new Map<number, Volunteer>();
    volunteers.forEach(volunteer => {
      // Map the API response to our Volunteer type
      volunteerMap.set(volunteer.volunteerId, {
        volunteerId: volunteer.volunteerId,
        userId: volunteer.userId,
        username: volunteer.username,
        fullName: volunteer.fullName,
        email: volunteer.email,
        institute: volunteer.institute,
        instituteEmail: volunteer.instituteEmail,
        isAvailable: volunteer.isAvailable,
        volunteerLevel: volunteer.volunteerLevel,
        rewardPoints: volunteer.rewardPoints,
        isEventHost: volunteer.isEventHost,
        joinedDate: volunteer.joinedDate,
        about: volunteer.about,
        phoneNumber: volunteer.phoneNumber,
        profilePictureUrl: volunteer.profilePictureUrl
      });
    });

    console.log(` Created volunteer map with ${volunteerMap.size} entries`);
    return volunteerMap;
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend server. Make sure the server is running.');
    }
    
    throw error;
  }
};

export const getVolunteerById = async (volunteerId: number): Promise<Volunteer> => {
  try {
    const volunteerMap = await getAllVolunteers();
    const volunteer = volunteerMap.get(volunteerId);
    
    if (!volunteer) {
      throw new Error(`Volunteer with ID ${volunteerId} not found`);
    }

    return volunteer;
  } catch (error) {
    console.error("Error fetching volunteer:", error);
    throw error;
  }
};

// Legacy function for backward compatibility - now uses token-based auth
export const getEventsByOrgId = async (orgId: number, status?: EventStatus): Promise<Event[]> => {
  console.warn("getEventsByOrgId is deprecated. Use getEventsByStatus instead.");
  return getEventsByStatus(status);
};