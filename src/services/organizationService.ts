export type Organization = {
  id: number;
  name: string;
  institute: string;
  imageUrl: string;
};

export const getOrganizationById = async (
  orgId: number
): Promise<Organization> => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/public/organizations/${orgId}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch organization: ${response.status}`);
    }
    const responseBody = await response.json();
    return responseBody.data as Organization;
  } catch (error) {
    console.error("Error fetching organization:", error);
    throw error;
  }
};
