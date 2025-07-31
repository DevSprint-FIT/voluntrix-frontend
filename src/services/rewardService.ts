import authService from "./authService";

export async function fetchVolunteerRewardStats() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  
  try {
    const response = await fetch(`${baseUrl}/api/tasks/volunteer/rewards`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch volunteer reward stats: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching volunteer reward stats:", error);
    return null;
  }
}