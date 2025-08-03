
const API_BASE_URL = 'http://localhost:8080/api/public';


interface SponsorshipRequest {
  requestId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; 
  sponsorId: number;
  sponsorshipId: number;
}

interface Sponsorship {
  sponsorshipId: number;
  type: string;
  price: number;
  benefits: string;
  eventId: number;
  available: boolean;
}

interface Event {
  eventId: number;
  eventTitle: string;
  eventDescription: string;
  eventLocation: string;
  eventStartDate: string;
  eventEndDate: string;
  eventTime: string;
  eventImageUrl: string;
  volunteerCount: number;
  eventType: string;
  eventVisibility: string;
  eventStatus: 'PENDING' | 'ACTIVE' | 'COMPLETE' | 'DENIED';
  sponsorshipEnabled: boolean;
  donationEnabled: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: any[];
  eventHostId: number;
  organizationId: number;
  eventHostRewardPoints: number;
}

// Combined interface for frontend use
interface SponsorEventData {
  eventId: number;
  eventTitle: string;
  eventStartDate: string;
  eventEndDate: string;
  eventLocation: string;
  eventStatus: string;
  sponsorshipAmount: number;
  sponsorshipType: string;
  requestStatus: string;
  requestId: number;
  sponsorshipId: number;
  volunteerCount: number;
  eventDescription: string;
}

class SponsorService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private volunteersCache: any[] | null = null;
  
  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      console.log(`Fetching: ${url}`); // Debug log
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}, url: ${url}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`Response for ${url}:`, result); // Debug log
      return result.data || result;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }

  // Get sponsorship requests for a sponsor
  async getSponsorshipRequests(sponsorId: number): Promise<SponsorshipRequest[]> {
    return this.fetchWithErrorHandling<SponsorshipRequest[]>(
      `${API_BASE_URL}/sponsorship-requests/sponsor/${sponsorId}`
    );
  }

  // Get sponsorship details
  async getSponsorship(sponsorshipId: number): Promise<Sponsorship> {
    return this.fetchWithErrorHandling<Sponsorship>(
      `${API_BASE_URL}/sponsorships/${sponsorshipId}`
    );
  }

  // Get event details
  async getEvent(eventId: number): Promise<Event> {
    return this.fetchWithErrorHandling<Event>(
      `${API_BASE_URL}/events/${eventId}`
    );
  }

  // Get all sponsor event data by combining multiple API calls
  async getAllSponsorEventData(sponsorId: number): Promise<SponsorEventData[]> {
    try {
      console.log(`Fetching sponsorship requests for sponsor: ${sponsorId}`);
      
      // Get all sponsorship requests for this sponsor
      const sponsorshipRequests = await this.getSponsorshipRequests(sponsorId);
      console.log('Sponsorship requests:', sponsorshipRequests);
      
      if (!sponsorshipRequests || sponsorshipRequests.length === 0) {
        console.log('No sponsorship requests found');
        return [];
      }
      
      const eventDataPromises = sponsorshipRequests.map(async (request) => {
        try {
          console.log(`Processing request ${request.requestId} for sponsorship ${request.sponsorshipId}`);
          
          // Get sponsorship details
          const sponsorship = await this.getSponsorship(request.sponsorshipId);
          console.log(`Sponsorship details for ${request.sponsorshipId}:`, sponsorship);
          
          // Get event details
          const event = await this.getEvent(sponsorship.eventId);
          console.log(`Event details for ${sponsorship.eventId}:`, event);
          
          // Combine all data
          return {
            eventId: event.eventId,
            eventTitle: event.eventTitle,
            eventStartDate: event.eventStartDate,
            eventEndDate: event.eventEndDate,
            eventLocation: event.eventLocation,
            eventStatus: event.eventStatus,
            sponsorshipAmount: sponsorship.price,
            sponsorshipType: sponsorship.type,
            requestStatus: request.status,
            requestId: request.requestId,
            sponsorshipId: request.sponsorshipId,
            volunteerCount: event.volunteerCount,
            eventDescription: event.eventDescription,
          };
        } catch (error) {
          console.error(`Error processing request ${request.requestId}:`, error);
          return null;
        }
      });

      const results = await Promise.all(eventDataPromises);
      const filteredResults = results.filter((item) => item !== null) as SponsorEventData[];
      console.log('Final combined data:', filteredResults);
      return filteredResults;
    } catch (error) {
      console.error('Error fetching sponsor event data:', error);
      throw error;
    }
  }

  // Filter methods for different tables
  getActiveEvents(allEventData: SponsorEventData[]): SponsorEventData[] {
    return allEventData.filter(event => 
      event.requestStatus === 'APPROVED' && 
      event.eventStatus === 'ACTIVE' 
    );
  }

  getCompletedEvents(allEventData: SponsorEventData[]): SponsorEventData[] {
    return allEventData.filter(event => 
      event.requestStatus === 'APPROVED' && 
      event.eventStatus === 'COMPLETE'
    );
  }

  getPendingRequests(allEventData: SponsorEventData[]): SponsorEventData[] {
    return allEventData.filter(event => 
      event.requestStatus === 'PENDING'
    );
  }

  getRejectedRequests(allEventData: SponsorEventData[]): SponsorEventData[] {
    return allEventData.filter(event => 
      event.requestStatus === 'REJECTED'
    );
  }

  // Utility method to check if event date has passed (for determining if payment is due)
  isEventUpcoming(eventStartDate: string): boolean {
    const eventDate = new Date(eventStartDate);
    const now = new Date();
    return eventDate > now;
  }

  // Method to update sponsorship request status (for approve/reject actions)
  // Note: This would typically be used by event hosts, not sponsors
  async updateSponsorshipRequestStatus(
    requestId: number, 
    status: 'APPROVED' | 'REJECTED'
  ): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/sponsorship-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error updating sponsorship request status:', error);
      return false;
    }
  }

  // Method to process payment (placeholder for actual payment integration)
  async processPayment(eventId: number, amount: number): Promise<boolean> {
    try {
      // This would integrate with your actual payment processing API
      // For now, it's a placeholder that simulates payment processing
      
      const response = await fetch(`${API_BASE_URL}/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          amount,
          type: 'SPONSORSHIP'
        }),
      });

      if (!response.ok) {
        throw new Error(`Payment failed! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error processing payment:', error);
      return false;
    }
  }

  // Get all volunteers (with caching)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getAllVolunteers(): Promise<any[]> {
    if (this.volunteersCache) {
      return this.volunteersCache;
    }
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.volunteersCache = await this.fetchWithErrorHandling<any[]>(
        `${API_BASE_URL}/volunteers`
      );
      return this.volunteersCache;
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      return [];
    }
  }

  // Get volunteer details by ID
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getVolunteer(volunteerId: number): Promise<any> {
    try {
      // Get all volunteers (uses cache if available)
      const allVolunteers = await this.getAllVolunteers();
      
      // Find the volunteer with matching ID
      const volunteer = allVolunteers.find(v => v.volunteerId === volunteerId);
      
      if (volunteer) {
        return volunteer;
      } else {
        console.warn(`Volunteer with ID ${volunteerId} not found`);
        return {
          volunteerId,
          firstName: 'Unknown',
          lastName: 'Host',
          profilePictureUrl: null
        };
      }
    } catch (error) {
      console.error(`Error fetching volunteer ${volunteerId}:`, error);
      // Return a default volunteer object if API call fails
      return {
        volunteerId,
        firstName: 'Unknown',
        lastName: 'Host',
        profilePictureUrl: null
      };
    }
  }
}

// Export singleton instance
export const sponsorService = new SponsorService();

// Export types for use in components
export type { SponsorEventData, SponsorshipRequest, Sponsorship, Event };