export type OrganizationSettings = {
  id: number;
  email: string;
  username: string;
  isVerified: boolean;
};

export const getOrganizationSettingsByUsername = async (username: string): Promise<OrganizationSettings> => {
  try {
    const response = await fetch(`http://localhost:8080/api/public/organizations/by-username/${username}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch organization settings: ${response.statusText}`);
    }

    const {id, email, usernamename, isVerified } = (await response.json()).data;

    return {id, email, username, isVerified };
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
    const response = await fetch(`http://localhost:8080/api/public/organizations/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update email: ${response.statusText}`);
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
    const response = await fetch(`http://localhost:8080/api/public/organizations/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete organization: ${response.statusText}`);
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
    const response = await fetch("http://localhost:8080/api/public/verify", {
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

