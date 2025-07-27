export interface VolunteerEventCounts {
  activeCount: number;
  appliedCount: number;
  completedCount: number;
}

// Fetch event counts (status counts)
export const getVolunteerEventCounts = async (
  volunteerId: number
): Promise<VolunteerEventCounts> => {
  try {
    const url = `http://localhost:8080/api/public/participations/volunteer/${volunteerId}/stats`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Status ${response.status}: ${response.statusText}`);
      console.error("Response body:", errorText);
      throw new Error(
        `Failed to fetch volunteer event counts: ${response.statusText}`
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
