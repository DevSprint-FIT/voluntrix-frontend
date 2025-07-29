export type VolunteerSettings = {
  volunteerId: number;
  email: string;
  username: string;
  isAvailable: boolean;
};

export const getVolunteerSettingsByUsername = async (
  username: string
): Promise<VolunteerSettings> => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/public/volunteers/${username}`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch volunteer settings: ${response.statusText}`
      );
    }

    const data = await response.json();
    return {
      volunteerId: data.volunteerId,
      email: data.email,
      username: data.username,
      isAvailable: data.isAvailable,
    };
  } catch (error) {
    console.error("Error fetching volunteer settings:", error);
    throw error;
  }
};

export const updateVolunteerEmail = async (
  volunteerId: number,
  email: string
): Promise<VolunteerSettings> => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/public/volunteers/${volunteerId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update email: ${response.statusText}`);
    }

    const data = await response.json();
    // Return the actual volunteer data, not wrapped in data property
    return data;
  } catch (error) {
    console.error("Error updating volunteer email:", error);
    throw error;
  }
};

export const updateVolunteerAvailability = async (
  volunteerId: number,
  isAvailable: boolean
): Promise<VolunteerSettings> => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/public/volunteers/${volunteerId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAvailable }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update availability: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating volunteer availability:", error);
    throw error;
  }
};
