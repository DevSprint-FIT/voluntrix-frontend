import authService from "./authService";

export async function getOrganizationByToken() {
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  if (!token) {
    throw new Error("Authentication token not found. Please check your environment variables.");
  }

  try {
    const response = await fetch(`${baseUrl}/api/organizations/me`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch organization: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Failed to fetch organization:", error);
    throw error;
  }
}