import authService from "@/services/authService";

export type VolunteerSettings = {
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
};

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
};

export const getVolunteerSettings = async (): Promise<VolunteerSettings> => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/volunteers/me`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch volunteer settings: ${response.status} ${response.statusText}`
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
    console.error("Error fetching volunteer settings:", error);
    throw error;
  }
};

export const updateVolunteerEmail = async (
  email: string
): Promise<VolunteerSettings> => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/volunteers/profile`, {
      method: "PATCH",
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update email: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating volunteer email:", error);
    throw error;
  }
};

export const updateVolunteerAvailability = async (
  isAvailable: boolean
): Promise<VolunteerSettings> => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/volunteers/profile`, {
      method: "PATCH",
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ isAvailable }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update availability: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating volunteer availability:", error);
    throw error;
  }
};
