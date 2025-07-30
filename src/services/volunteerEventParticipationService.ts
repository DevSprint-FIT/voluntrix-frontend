import axios from 'axios';
import authService from '@/services/authService';

export const createVolunteerEventParticipation = async (
  eventId: number,
  volunteerId: number,
  areaOfContribution: string
) => {
  const payload = {
    eventId,
    volunteerId,
    areaOfContribution,
  };

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/participations`,
      payload,
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );
    return response.status === 201;
  } catch (error) {
    console.error('Error creating volunteer event participation:', error);
    throw error;
  }
};
