export type VolunteerSettings = {
  volunteerId: number;
  email: string;
  username: string;
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

    const { volunteerId, email, usernamename } = await response.json();
    return {
      volunteerId,
      email,
      username,
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

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating volunteer email:", error);
    throw error;
  }
};
