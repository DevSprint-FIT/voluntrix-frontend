import axios from 'axios';
import { EventApplicationCreateType } from '@/types/EventApplicationCreateType';
import { EventApplicAndVolType } from '@/types/EventApplicAndVolType';
import authService from '@/services/authService';

export const createEventApplication = async (
  data: EventApplicationCreateType
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event-applications`,
      data,
      {
        headers: authService.getAuthHeadersAxios(),
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
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event-applications/event/volunteers/${eventId}`,
      {
        headers: authService.getAuthHeadersAxios(),
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
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event-applications/${applicationId}`,
      { applicationStatus },
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );

    console.log('Application status updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};
