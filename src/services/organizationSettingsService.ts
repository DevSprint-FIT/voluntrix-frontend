import authService from "./authService";

export type OrganizationSettings = {
  id: number;
  email: string;
  username: string;
  isVerified: boolean;
  imageUrl: string;
  name: string;
  institute: string;
  phone?: string;
};


const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
};

export const getOrganizationSettings = async (): Promise<OrganizationSettings> => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/organizations/me`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch organization settings: ${response.status} ${response.statusText}`);
    }

    const { data } = await response.json();
    
    return {
      id: data.id,
      email: data.email,
      username: data.username,
      isVerified: data.isVerified,
      imageUrl: data.imageUrl,
      name: data.name,
      institute: data.institute,
      phone: data.phone || "", 
    };
  } catch (error) {
    console.error("Error fetching organization settings:", error);
    throw error;
  }
};

export const updateOrganizationPhone = async (
  id: number,
  phone: string
): Promise<OrganizationSettings> => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/organizations/profile`, {
      method: "PATCH",
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update phone number: ${response.status} ${response.statusText}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating phone number:", error);
    throw error;
  }
};

export const deleteOrganizationById = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/users/account`, {
      method: "DELETE",
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete organization: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting organization:", error);
    throw error;
  }
};

export const sendVerificationCode = async (
  phone: string,
  captchaToken: string
): Promise<void> => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/verify/phone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, captchaToken }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Verification failed: ${text}`);
    }
  } catch (error) {
    console.error("Verification error:", error);
    throw error;
  }
};