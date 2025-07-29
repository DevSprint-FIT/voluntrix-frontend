import axios from 'axios';
import { EventApplicationCreateType } from '@/types/EventApplicationCreateType';
import { EventApplicAndVolType } from '@/types/EventApplicAndVolType';

export const createEventApplication = async (
  data: EventApplicationCreateType
) => {
  // authentication token
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event-applications`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Application submitted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};

export const getEventApplicAndVol = async (
  eventId: number
): Promise<EventApplicAndVolType[]> => {
  // authentication token
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event-applications/event/volunteers/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Fetched event applications successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching event applications:', error);
    throw error;
  }
};

export const updateEventApplicationStatus = async (
  applicationId: number,
  applicationStatus: 'APPROVED' | 'REJECTED'
) => {
  // authentication token
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event-applications/${applicationId}`,
      { applicationStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Application status updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};
