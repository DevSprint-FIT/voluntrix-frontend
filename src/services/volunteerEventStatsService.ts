import authService from "@/services/authService";

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
};

export interface VolunteerEventCounts {
  activeCount: number;
  appliedCount: number;
  completedCount: number;
}

// Fetch event counts (status counts) for authenticated volunteer
export const getVolunteerEventCounts =
  async (): Promise<VolunteerEventCounts> => {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/participations/volunteer/stats`,
        {
          method: "GET",
          headers: authService.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Status ${response.status}: ${response.statusText}`);
        console.error("Response body:", errorText);
        throw new Error(
          `Failed to fetch volunteer event counts: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Map the response data
      const mappedData: VolunteerEventCounts = {
        activeCount: data.activeCount ?? 0,
        appliedCount: data.appliedCount ?? 0,
        completedCount: data.completedCount ?? 0,
      };

      return mappedData;
    } catch (error) {
      console.error("Error fetching volunteer event counts:", error);
      throw error;
    }
  };
