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
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  username: string; 
};

// Fetch events by status 
export const getEventsByOrgId = async (orgId: number, status?: EventStatus): Promise<Event[]> => {
  try {
    let url = `http://localhost:8080/api/public/organizations/${orgId}/events`;
    if (status) {
      url += `?status=${status}`;
    }

    console.log(`🔍 Making API request to: ${url}`);

    const response = await fetch(url);
    
    console.log(` Response status: ${response.status}`);
    console.log(` Response ok: ${response.ok}`);

    if (!response.ok) {
      // Handle 404 as "no data found" instead of an error
      if (response.status === 404) {
        console.log(` No events found for orgId ${orgId} with status ${status || 'any'} (404)`);
        return []; // Return empty array instead of throwing error
      }
      
      
      let errorMessage = `Failed to fetch events: ${response.status} ${response.statusText}`;
      
      try {
        const errorData = await response.text();
        console.log(`🔍 Error response body:`, errorData);
        
        
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.message || parsedError.error || errorMessage;
        } catch (parseError) {
          
          if (errorData) {
            errorMessage = errorData;
          }
        }
      } catch (textError) {
        console.log(`🔍 Could not read error response body`);
      }

      
      if (response.status === 500) {
        throw new Error(`Server error: ${errorMessage}`);
      } else {
        throw new Error(errorMessage);
      }
    }

    const data = await response.json();
    console.log(` Successfully fetched ${data?.length || 0} events for orgId ${orgId}`);
    
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("🔍 Error fetching events:", error);
    
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend server. Make sure the server at http://localhost:8080 is running.');
    }
    
    throw error;
  }
};

// Update event status
export const updateEventStatus = async (eventId: number, status: EventStatus): Promise<Event> => {
  try {
    const url = `http://localhost:8080/api/public/events/${eventId}`;
    
    console.log(`Making PATCH request to: ${url}`);
    console.log(`Request body:`, { eventStatus: status });
    
    // Create request body with explicit property and value
    const requestBody = {
      eventStatus: status
    };
    
    console.log(`Stringified body: ${JSON.stringify(requestBody)}`);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
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
      const updatedEvent = JSON.parse(responseText);
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

// Fetch all volunteers and return as a map for easier lookup
export const getAllVolunteers = async (): Promise<Map<number, Volunteer>> => {
  try {
    const url = `http://localhost:8080/api/public/volunteers`;
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch volunteers: ${response.status} ${response.statusText}`);
    }

    const volunteers: Volunteer[] = await response.json();
    
    // Create a map for quick lookup by volunteerId
    const volunteerMap = new Map<number, Volunteer>();
    volunteers.forEach(volunteer => {
      volunteerMap.set(volunteer.volunteerId, {
        volunteerId: volunteer.volunteerId,
        firstName: volunteer.firstName,
        lastName: volunteer.lastName,
        profilePictureUrl: volunteer.profilePictureUrl,
        username: volunteer.username
      });
    });

    return volunteerMap;
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    throw error;
  }
};

// Fetch volunteer details by ID - returns only what need for display
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