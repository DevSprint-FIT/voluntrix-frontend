import authService from "./authService";

export type Organization = {
  id: number;
  name: string;
  institute: string;
  imageUrl: string;
};

// Get current organization using token
export const getOrganizationByToken = async (): Promise<Organization> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  try {
    const response = await fetch(`${baseUrl}/api/organizations/me`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch organization: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Failed to fetch organization:", error);
    throw error;
  }
};

// Get all organizations 
export const getAllOrganizations = async (): Promise<Organization[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  try {
    const response = await fetch(`${baseUrl}/api/organizations/all`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch organizations: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw error;
  }
};

// Legacy function for backward compatibility
export const getOrganizationById = async (orgId: number): Promise<Organization> => {
  console.warn("getOrganizationById is deprecated. Use getOrganizationByToken instead.");
  return getOrganizationByToken();
};