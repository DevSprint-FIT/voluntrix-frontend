// Organization Service - Functional Approach
import { apiRequest } from './apiService';

// Types
export interface OrganizationCreateDTO {
  phone: string;
  institute: string;
  imageUrl?: string;
  bankName: string;
  accountNumber: string;
  description: string;
  documentUrl?: string;
  website?: string;
  facebookLink?: string;
  linkedinLink?: string;
  instagramLink?: string;
}

export interface OrganizationResponse {
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
  website?: string;
  bankName: string;
  imageUrl?: string;
  documentUrl?: string;
  facebookLink?: string;
  linkedinLink?: string;
  instagramLink?: string;
}

// Helper function to upload file to backend
const uploadFile = async (file: File, type: 'image' | 'document'): Promise<string | null> => {
  if (!file) return null;

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await apiRequest('/api/upload', {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header, let browser set it for FormData
      headers: {},
    });

    return response.url || response.filePath || null;
  } catch (error) {
    console.error(`Error uploading ${type}:`, error);
    throw new Error(`Failed to upload ${type}`);
  }
};

// Main organization creation function
export const createOrganization = async (formData: {
  phone: string;
  institute: string;
  imageUrl: File | null;
  bankName: string;
  accountNumber: string;
  description: string;
  website: string;
  facebookLink: string;
  linkedinLink: string;
  instagramLink: string;
  verificationDocument: File | null;
}): Promise<OrganizationResponse> => {
  try {
    // Upload files first if they exist
    let imageUrl: string | null = null;
    let documentUrl: string | null = null;

    if (formData.imageUrl) {
      imageUrl = await uploadFile(formData.imageUrl, 'image');
    }

    if (formData.verificationDocument) {
      documentUrl = await uploadFile(formData.verificationDocument, 'document');
    }

    // Prepare DTO for backend
    const organizationData: OrganizationCreateDTO = {
      phone: formData.phone,
      institute: formData.institute,
      imageUrl: imageUrl || undefined,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      description: formData.description,
      documentUrl: documentUrl || undefined,
      website: formData.website || undefined,
      facebookLink: formData.facebookLink || undefined,
      linkedinLink: formData.linkedinLink || undefined,
      instagramLink: formData.instagramLink || undefined,
    };

    // Remove empty optional fields
    Object.keys(organizationData).forEach(key => {
      const value = organizationData[key as keyof OrganizationCreateDTO];
      if (value === '' || value === undefined) {
        delete organizationData[key as keyof OrganizationCreateDTO];
      }
    });

    // Send to backend
    const response = await apiRequest<OrganizationResponse>('/api/organizations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(organizationData),
    });

    return response;
  } catch (error) {
    console.error('Error creating organization:', error);
    throw error;
  }
};
