import axios from 'axios';
import authService from '@/services/authService';

export const createEventInvitation = async (
  eventId: number,
  organizationId: number
) => {
  const payload = {
    eventId,
    organizationId,
    applicationStatus: 'PENDING',
  };

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event-invitations`,
      payload,
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );
    return response.status === 201;
  } catch (error) {
    console.error('Error creating event invitation:', error);
    throw error;
  }
};
