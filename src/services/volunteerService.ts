// Volunteer Service - Functional Approach
import { apiRequest } from "./apiService";

// Types for Volunteer API
export interface VolunteerCreateDTO {
  institute: string;
  instituteEmail: string;
  isAvailable: boolean;
  about: string;
  profilePictureUrl?: string;
  phoneNumber: string;
}

export interface VolunteerResponse {
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
  profilePictureUrl?: string;
}

// Helper function to upload profile picture
const uploadProfilePicture = async (file: File): Promise<string | null> => {
  if (!file) return null;

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'profile');

    const response = await apiRequest('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {},
    });

    return response.url || response.filePath || null;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw new Error('Failed to upload profile picture');
  }
};

// Main volunteer creation function
export const createVolunteer = async (formData: {
  selectedInstitute: string;
  instituteEmail: string;
  isAvailable: boolean;
  about: string;
  profilePicture: File | null;
  phoneNumber: string;
  selectedCategories: string[];
}): Promise<VolunteerResponse> => {
  try {
    // Upload profile picture if provided
    let profilePictureUrl: string | null = null;
    if (formData.profilePicture) {
      profilePictureUrl = await uploadProfilePicture(formData.profilePicture);
    }

    // Prepare DTO for backend
    const volunteerData: VolunteerCreateDTO = {
      institute: formData.selectedInstitute,
      instituteEmail: formData.instituteEmail,
      isAvailable: formData.isAvailable,
      about: formData.about,
      profilePictureUrl: profilePictureUrl || undefined,
      phoneNumber: formData.phoneNumber,
    };

    // Remove empty optional fields
    Object.keys(volunteerData).forEach(key => {
      const value = volunteerData[key as keyof VolunteerCreateDTO];
      if (value === '' || value === undefined) {
        delete volunteerData[key as keyof VolunteerCreateDTO];
      }
    });

    // Send to backend
    const response = await apiRequest<VolunteerResponse>('/api/volunteers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(volunteerData),
    });

    return response;
  } catch (error) {
    console.error('Error creating volunteer:', error);
    throw error;
  }
};