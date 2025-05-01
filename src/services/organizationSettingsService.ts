export type OrganizationSettings = {
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

    const { email, usernamename, accountNumber, isVerified } = (await response.json()).data;

    return { email, username, accountNumber, isVerified };
  } catch (error) {
    console.error("Error fetching organization settings:", error);
    throw error;
  }
};
