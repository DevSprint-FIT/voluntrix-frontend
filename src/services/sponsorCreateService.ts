// Sponsor Service - Functional Approach
import { apiRequest } from "./apiService";

// Types for Sponsor API
export interface SponsorCreateDTO {
  company: string;
  jobTitle: string;
  mobileNumber: string;
  website: string;
  sponsorshipNote: string;
  documentUrl?: string;
  linkedinProfile: string;
  address: string;
}

export interface SponsorResponseData {
  sponsorId: number;
  name: string;
  email: string;
  company: string;
  verified: boolean;
  jobTitle: string;
  mobileNumber: string;
  website: string;
  sponsorshipNote: string;
  documentUrl?: string;
  linkedinProfile: string;
  address: string;
  appliedAt: string;
}

export interface SponsorResponse {
  message: string;
  data: SponsorResponseData;
}

// Helper function to upload document
const uploadDocument = async (file: File): Promise<string | null> => {
  if (!file) return null;

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'document');

    const response = await apiRequest('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {},
    });

    return response.url || response.filePath || null;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw new Error('Failed to upload document');
  }
};

// Main sponsor creation function
export const createSponsor = async (formData: {
  company: string;
  jobTitle: string;
  mobileNumber: string;
  website: string;
  sponsorshipNote: string;
  documentUrl: File | null;
  linkedinProfile: string;
  address: string;
}): Promise<SponsorResponse> => {
  try {
    // Upload document if provided
    let documentUrl: string | null = null;
    if (formData.documentUrl) {
      documentUrl = await uploadDocument(formData.documentUrl);
    }

    // Prepare DTO for backend
    const sponsorData: SponsorCreateDTO = {
      company: formData.company,
      jobTitle: formData.jobTitle,
      mobileNumber: formData.mobileNumber,
      website: formData.website,
      sponsorshipNote: formData.sponsorshipNote,
      documentUrl: documentUrl || undefined,
      linkedinProfile: formData.linkedinProfile,
      address: formData.address,
    };

    // Remove empty optional fields
    Object.keys(sponsorData).forEach(key => {
      const value = sponsorData[key as keyof SponsorCreateDTO];
      if (value === '' || value === undefined) {
        delete sponsorData[key as keyof SponsorCreateDTO];
      }
    });

    // Send to backend
    const response = await apiRequest<SponsorResponse>('/api/sponsors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sponsorData),
    });

    return response;
  } catch (error) {
    console.error('Error creating sponsor:', error);
    throw error;
  }
};
