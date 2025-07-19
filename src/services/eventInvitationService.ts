import axios from 'axios';

export const createEventInvitation = async (
  eventId: number,
  organizationId: number
) => {
  const token = localStorage.getItem('token');

  const payload = {
    eventId,
    organizationId,
    applicationStatus: 'PENDING',
  };

  try {
    const response = await axios.post(
      'http://localhost:8080/api/public/event-invitations',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.status === 201;
  } catch (error) {
    console.error('Error creating event invitation:', error);
    throw error;
  }
};
