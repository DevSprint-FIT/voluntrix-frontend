import axios from "axios";
import authService from "@/services/authService";

export interface VolunteerProfile {
  volunteerId: number;
  userId: number;
  username: string;
  fullName: string;
  email: string;
  institute?: string;
  instituteEmail?: string;
  isAvailable: boolean;
  volunteerLevel: number;
  rewardPoints: number;
  isEventHost: boolean;
  joinedDate: string;
  about: string;
  phoneNumber: string;
  profilePictureUrl: string;
}

export interface Organization {
  id: number;
  name: string;
  username: string;
  institute: string;
  email: string;
  phone: string;
  accountNumber: string;
  isVerified: boolean;
  followerCount: number;
  joinedDate: string;
  description: string;
  website: string;
  bankName: string;
  imageUrl: string;
}

export interface OrganizationResponse {
  message: string;
  data: Organization;
}

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
};

export const volunteerProfileService = {
  // Get volunteer profile (current user)
  async getVolunteerProfile(): Promise<VolunteerProfile> {
    try {
      const response = await fetch(`${getBaseUrl()}/api/volunteers/me`, {
        method: "GET",
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch volunteer profile: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      return {
        volunteerId: data.volunteerId,
        userId: data.userId,
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        institute: data.institute,
        instituteEmail: data.instituteEmail,
        isAvailable: data.isAvailable,
        volunteerLevel: data.volunteerLevel,
        rewardPoints: data.rewardPoints,
        isEventHost: data.isEventHost,
        joinedDate: data.joinedDate,
        about: data.about,
        phoneNumber: data.phoneNumber,
        profilePictureUrl: data.profilePictureUrl,
      };
    } catch (error) {
      console.error("Error fetching volunteer profile:", error);
      throw error;
    }
  },

  // Get organization IDs followed by volunteer
  async getFollowedOrganizationIds(): Promise<number[]> {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/follow/followed-organizations`,
        {
          method: "GET",
          headers: authService.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch followed organizations: ${response.status} ${response.statusText}`
        );
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching followed organization IDs:", error);
      throw error;
    }
  },

  // Get organization details by ID
  async getOrganizationById(id: number): Promise<Organization> {
    try {
      const url = `${getBaseUrl()}/api/public/organizations/${id}`;
      console.log(`Fetching organization data from: ${url}`);

      const response = await fetch(url, {
        method: "GET",
        headers: authService.getAuthHeaders(),
      });

      console.log(`Response status for organization ${id}:`, response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response for organization ${id}:`, errorText);
        throw new Error(
          `Failed to fetch organization details: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data: OrganizationResponse = await response.json();
      console.log(`Successfully fetched organization ${id}:`, data);
      return data.data;
    } catch (error) {
      console.error(`Error fetching organization ${id}:`, error);
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(
          `Network error: Unable to connect to the server. Please check if the backend is running at ${getBaseUrl()}`
        );
      }
      throw error;
    }
  },

  // Get all followed organizations details
  async getFollowedOrganizations(): Promise<Organization[]> {
    try {
      console.log("Fetching followed organization IDs...");
      const organizationIds = await this.getFollowedOrganizationIds();
      console.log("Followed organization IDs:", organizationIds);

      if (organizationIds.length === 0) {
        console.log("No followed organizations found");
        return [];
      }

      console.log(
        `Fetching details for ${organizationIds.length} organizations...`
      );
      const organizations = await Promise.all(
        organizationIds.map(async (id) => {
          try {
            return await this.getOrganizationById(id);
          } catch (error) {
            console.error(`Failed to fetch organization ${id}:`, error);
            // Skip this organization if it fails, don't fail the entire request
            return null;
          }
        })
      );

      // Filter out null values (failed requests)
      const validOrganizations = organizations.filter(
        (org): org is Organization => org !== null
      );
      console.log(
        `Successfully fetched ${validOrganizations.length} out of ${organizationIds.length} organizations`
      );

      return validOrganizations;
    } catch (error) {
      console.error("Error fetching followed organizations:", error);
      throw error;
    }
  },

  // Unfollow an organization
  async unfollowOrganization(organizationId: number): Promise<string> {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/follow/${organizationId}`,
        {
          method: "DELETE",
          headers: authService.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to unfollow organization: ${response.status} ${response.statusText}`
        );
      }

      return response.text();
    } catch (error) {
      console.error("Error unfollowing organization:", error);
      throw error;
    }
  },

  // Format joined date
  formatJoinedDate(joinedDate: string): string {
    try {
      const date = new Date(joinedDate);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown";
    }
  },
};

export const fetchVolunteer = async (): Promise<VolunteerProfile> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/volunteers/me`,
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching volunteer profile:", error);
    throw error;
  }
};

export const promoteToEventHost = async () => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/volunteers/promote-to-event-host`,
      {},
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error making volunteer an event host:", error);
    throw error;
  }
};
