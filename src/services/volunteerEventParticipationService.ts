import axios from 'axios';

export const createVolunteerEventParticipation = async (
  eventId: number,
  volunteerId: number,
  areaOfContribution: string
) => {
  // const token = localStorage.getItem('token'); // authentication token

  const payload = {
    eventId,
    volunteerId,
    areaOfContribution,
  };

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/participations`,
      payload,
      {
        headers: {
          // Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.status === 201;
  } catch (error) {
    console.error('Error creating volunteer event participation:', error);
    throw error;
  }
};
