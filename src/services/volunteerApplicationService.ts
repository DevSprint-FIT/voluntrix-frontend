import axios from 'axios';

export const fetchVolunteer = async () => {
  // authentication token
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/volunteers/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    throw error;
  }
};
