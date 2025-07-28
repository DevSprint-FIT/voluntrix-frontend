import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/public';

export interface VolunteerProfile {
  volunteerId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  institute: string;
  isAvailable: boolean;
  volunteerLevel: number;
  rewardPoints: number;
  isEventHost: boolean;
  joinedDate: number[];
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
  joinedDate: number[];
  description: string;
  website: string;
  bankName: string;
  imageUrl: string;
}

export interface OrganizationResponse {
  message: string;
  data: Organization;
}

export const volunteerProfileService = {
  // Get volunteer profile by username
  async getVolunteerProfile(username: string): Promise<VolunteerProfile> {
    const response = await fetch(`${API_BASE_URL}/volunteers/${username}`);
    if (!response.ok) {
      throw new Error('Failed to fetch volunteer profile');
    }
    return response.json();
  },

  // Get organization IDs followed by volunteer
  async getFollowedOrganizationIds(volunteerId: number): Promise<number[]> {
    const response = await fetch(`${API_BASE_URL}/follow/${volunteerId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch followed organizations');
    }
    return response.json();
  },

  // Get organization details by ID
  async getOrganizationById(id: number): Promise<Organization> {
    const response = await fetch(`${API_BASE_URL}/organizations/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch organization details');
    }
    const data: OrganizationResponse = await response.json();
    return data.data;
  },

  // Get all followed organizations details
  async getFollowedOrganizations(volunteerId: number): Promise<Organization[]> {
    const organizationIds = await this.getFollowedOrganizationIds(volunteerId);
    const organizations = await Promise.all(
      organizationIds.map((id) => this.getOrganizationById(id))
    );
    return organizations;
  },

  // Unfollow an organization
  async unfollowOrganization(
    volunteerId: number,
    organizationId: number
  ): Promise<string> {
    const response = await fetch(
      `${API_BASE_URL}/follow/${volunteerId}/${organizationId}`,
      {
        method: 'DELETE',
      }
    );
    if (!response.ok) {
      throw new Error('Failed to unfollow organization');
    }
    return response.text();
  },

  // Format joined date
  formatJoinedDate(joinedDate: number[]): string {
    if (joinedDate.length >= 3) {
      const [year, month, day] = joinedDate;
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return 'Unknown';
  },
};

export const fetchVolunteer = async (
  username: string
): Promise<VolunteerProfile> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/volunteers/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching volunteer profile:', error);
    throw error;
  }
};

export const makeEventHost = async (id: number) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/volunteers/${id}`, {
      isEventHost: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error making volunteer an event host:', error);
    throw error;
  }
};
