export type OrganizationSettings = {
  id: number;
  email: string;
  username: string;
  isVerified: boolean;
  imageUrl: string;
  name: string;
  institute: string;
};

const getAuthHeaders = () => {
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  if (!token) {
    throw new Error("Authentication token not found. Please check your environment variables.");
  }
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";
};

export const getOrganizationSettings = async (): Promise<OrganizationSettings> => {
  try {
    const response = await fetch(`${getBaseUrl()}/organizations/me`, {
      method: "GET",
      headers: getAuthHeaders(),
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
      institute: data.institute
    };
  } catch (error) {
    console.error("Error fetching organization settings:", error);
    throw error;
  }
};

export const updateOrganizationEmail = async (
  id: number,
  email: string
): Promise<OrganizationSettings> => {
  try {
    const response = await fetch(`${getBaseUrl()}/organizations/profile`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update email: ${response.status} ${response.statusText}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating email:", error);
    throw error;
  }
};

export const deleteOrganizationById = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${getBaseUrl()}/users/account`, {
      method: "DELETE",
      headers: getAuthHeaders(),
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
    const response = await fetch(`${getBaseUrl()}/verify`, {
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