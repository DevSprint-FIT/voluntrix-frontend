export async function fetchVolunteerRewardStats(username: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/public/tasks/volunteer/${username}/rewards`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch volunteer reward stats");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching volunteer reward stats:", error);
    return null;
  }
}
