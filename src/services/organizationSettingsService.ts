export type OrganizationSettings = {
  id: number;
  email: string;
  username: string;
  accountNumber: string;
  isVerified: boolean;
};

export const getOrganizationSettingsByUsername = async (username: string): Promise<OrganizationSettings> => {
  try {
    const response = await fetch(`http://localhost:8080/api/public/organizations/by-username/${username}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch organization settings: ${response.statusText}`);
    }

    const {id, email, usernamename, accountNumber, isVerified } = (await response.json()).data;

    return {id, email, username, accountNumber, isVerified };
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

