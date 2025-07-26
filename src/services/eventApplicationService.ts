import axios from 'axios';
import { EventApplicationCreateType } from '@/types/EventApplicationCreateType';
import { EventApplicAndVolType } from '@/types/EventApplicAndVolType';

export const CreateEventApplication = async (
  data: EventApplicationCreateType
) => {
  try {
    const response = await axios.post(
      'http://localhost:8080/api/public/event-applications',
      data,
      {
        headers: {
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
  try {
    const response = await axios.get(
      `http://localhost:8080/api/public/event-applications/event/volunteers/${eventId}`
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
  const token = localStorage.getItem('token'); // authentication token

  try {
    const response = await axios.patch(
      `http://localhost:8080/api/public/event-applications/${applicationId}`,
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
