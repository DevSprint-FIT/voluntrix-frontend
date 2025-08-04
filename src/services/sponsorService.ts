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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// Interface for the new sponsorship request table data
interface SponsorRequestTableDTO {
  requestId: number;
  price: number;
  type: string;
  eventTitle: string;
  eventId: number;
  eventStartDate: number[];
  paymentStatus: "FULLPAID" | "PARTIALPAID" | "UNPAID";
  totalAmountPaid: number;
}

// Status enums
type SponsorshipRequestStatus = "APPROVED" | "REJECTED" | "PENDING";
type SponsorshipPaymentStatus = "FULLPAID" | "PARTIALPAID" | "UNPAID";

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
  // Get sponsorship requests by status using the new API endpoint
  async getSponsorshipRequestsByStatus(
    status: SponsorshipRequestStatus
  ): Promise<SponsorRequestTableDTO[]> {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/sponsorship-requests/sponsor/status/${status}`,
        {
          method: "GET",
          headers: authService.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error(
        `Error fetching sponsorship requests with status ${status}:`,
        error
      );
      return [];
    }
  }

  // Get counts for all sponsorship request statuses
  async getSponsorshipRequestCounts(): Promise<{
    approved: number;
    pending: number;
    rejected: number;
  }> {
    try {
      const [approvedRequests, pendingRequests, rejectedRequests] =
        await Promise.all([
          this.getSponsorshipRequestsByStatus("APPROVED"),
          this.getSponsorshipRequestsByStatus("PENDING"),
          this.getSponsorshipRequestsByStatus("REJECTED"),
        ]);

      return {
        approved: approvedRequests.length,
        pending: pendingRequests.length,
        rejected: rejectedRequests.length,
      };
    } catch (error) {
      console.error("Error fetching sponsorship request counts:", error);
      return { approved: 0, pending: 0, rejected: 0 };
    }
  }

  // Helper method to format date array to readable date string
  formatDateArray(dateArray: number[]): string {
    if (!dateArray || dateArray.length < 3) return "N/A";
    const [year, month, day] = dateArray;
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

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

  // Get dashboard stats with dummy values for incomplete backend features
  getDashboardStats() {
    return {
      totalEventsSponsored: 5,
      totalSponsorships: 5,
      totalEventsDonated: 2,
      totalSponsorshipAmount: "LKR 250,000",
    };
  }

  // Get dummy sponsored event dates for calendar highlighting
  getSponsoredEventDates(): Date[] {
    return [
      new Date(2025, 6, 1), // July 1, 2025
      new Date(2025, 8, 25), // September 25, 2025
    ];
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
      const response = await fetch(url, {
        method: "GET",
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
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
      // Get all sponsorship requests for this sponsor
      const sponsorshipRequests = await this.getSponsorshipRequests();

      if (!sponsorshipRequests || sponsorshipRequests.length === 0) {
        return [];
      }

      const eventDataPromises = sponsorshipRequests.map(async (request) => {
        try {
          // Get sponsorship details
          const sponsorship = await this.getSponsorship(request.sponsorshipId);

          // Get event details
          const event = await this.getEvent(sponsorship.eventId);

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
  SponsorRequestTableDTO,
  SponsorshipRequestStatus,
  SponsorshipPaymentStatus,
};
