import axios from 'axios';

export const createEventInvitation = async (
  eventId: number,
  organizationId: number
) => {
  // authentication token
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

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
