import authService from "@/services/authService";

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
};

interface SponsorshipRequest {
  requestId: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
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
  eventStatus: "PENDING" | "ACTIVE" | "COMPLETE" | "DENIED";
  sponsorshipEnabled: boolean;
  donationEnabled: boolean;
  categories: any[];
  eventHostId: number;
  organizationId: number;
  eventHostRewardPoints: number;
}

interface SponsorProfile {
  sponsorId: number;
  name: string;
  handle: string;
  email: string;
  company: string;
  verified: boolean;
  jobTitle: string;
  mobileNumber: string;
  website: string;
  sponsorshipNote: string;
  documentUrl: string | null;
  imageUrl: string;
  linkedinProfile: string;
  address: string;
  appliedAt: number[];
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
  // Get sponsor profile information
  async getSponsorProfile(): Promise<SponsorProfile | null> {
    try {
      const response = await fetch(`${getBaseUrl()}/api/sponsors/me`, {
        method: "GET",
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching sponsor profile:", error);
      return null;
    }
  }

  // Update sponsor profile information
  async updateSponsorProfile(
    updateData: Partial<SponsorProfile>
  ): Promise<SponsorProfile> {
    try {
      const response = await fetch(`${getBaseUrl()}/api/sponsors/profile`, {
        method: "PATCH",
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error updating sponsor profile:", error);
      throw error;
    }
  }

  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      console.log(`Fetching: ${url}`); // Debug log
      const response = await fetch(url, {
        method: "GET",
        headers: authService.getAuthHeaders(),
      });

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
  async getSponsorshipRequests(): Promise<SponsorshipRequest[]> {
    return this.fetchWithErrorHandling<SponsorshipRequest[]>(
      `${getBaseUrl()}/api/sponsorship-requests/sponsor/my-requests`
    );
  }

  // Get sponsorship details
  async getSponsorship(sponsorshipId: number): Promise<Sponsorship> {
    return this.fetchWithErrorHandling<Sponsorship>(
      `${getBaseUrl()}/api/sponsorships/${sponsorshipId}`
    );
  }

  // Get event details
  async getEvent(eventId: number): Promise<Event> {
    return this.fetchWithErrorHandling<Event>(
      `${getBaseUrl()}/api/events/${eventId}`
    );
  }

  // Get all sponsor event data by combining multiple API calls
  async getAllSponsorEventData(): Promise<SponsorEventData[]> {
    try {
      console.log(`Fetching sponsorship requests for sponsor`);

      // Get all sponsorship requests for this sponsor
      const sponsorshipRequests = await this.getSponsorshipRequests();
      console.log("Sponsorship requests:", sponsorshipRequests);

      if (!sponsorshipRequests || sponsorshipRequests.length === 0) {
        console.log("No sponsorship requests found");
        return [];
      }

      const eventDataPromises = sponsorshipRequests.map(async (request) => {
        try {
          console.log(
            `Processing request ${request.requestId} for sponsorship ${request.sponsorshipId}`
          );

          // Get sponsorship details
          const sponsorship = await this.getSponsorship(request.sponsorshipId);
          console.log(
            `Sponsorship details for ${request.sponsorshipId}:`,
            sponsorship
          );

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
          console.error(
            `Error processing request ${request.requestId}:`,
            error
          );
          return null;
        }
      });

      const results = await Promise.all(eventDataPromises);
      const filteredResults = results.filter(
        (item) => item !== null
      ) as SponsorEventData[];
      console.log("Final combined data:", filteredResults);
      return filteredResults;
    } catch (error) {
      console.error("Error fetching sponsor event data:", error);
      throw error;
    }
  }

  // Filter methods for different tables
  getActiveEvents(allEventData: SponsorEventData[]): SponsorEventData[] {
    return allEventData.filter(
      (event) =>
        event.requestStatus === "APPROVED" && event.eventStatus === "ACTIVE"
    );
  }

  getCompletedEvents(allEventData: SponsorEventData[]): SponsorEventData[] {
    return allEventData.filter(
      (event) =>
        event.requestStatus === "APPROVED" && event.eventStatus === "COMPLETE"
    );
  }

  getPendingRequests(allEventData: SponsorEventData[]): SponsorEventData[] {
    return allEventData.filter((event) => event.requestStatus === "PENDING");
  }

  getRejectedRequests(allEventData: SponsorEventData[]): SponsorEventData[] {
    return allEventData.filter((event) => event.requestStatus === "REJECTED");
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
    status: "APPROVED" | "REJECTED"
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/sponsorship-requests/${requestId}`,
        {
          method: "PUT",
          headers: authService.getAuthHeaders(),
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error updating sponsorship request status:", error);
      return false;
    }
  }

  // Method to process payment (placeholder for actual payment integration)
  async processPayment(eventId: number, amount: number): Promise<boolean> {
    try {
      // This would integrate with your actual payment processing API
      // For now, it's a placeholder that simulates payment processing

      const response = await fetch(`${getBaseUrl()}/api/payments/process`, {
        method: "POST",
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({
          eventId,
          amount,
          type: "SPONSORSHIP",
        }),
      });

      if (!response.ok) {
        throw new Error(`Payment failed! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error processing payment:", error);
      return false;
    }
  }
}

// Export singleton instance
export const sponsorService = new SponsorService();

// Export types for use in components
export type {
  SponsorEventData,
  SponsorshipRequest,
  Sponsorship,
  Event,
  SponsorProfile,
};
