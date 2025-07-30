import axios from 'axios';
import authService from '@/services/authService';

export const fetchVolunteer = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/volunteers/me`,
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    throw error;
  }
};
