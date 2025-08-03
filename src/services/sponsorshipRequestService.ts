import axios from 'axios';
import authService from '@/services/authService';
import { SponsorshipRequestType } from '@/types/SponsorshipRequestType';

export const fetchSponsorshipRequestByEvent = async (id: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sponsorship-requests/event/${id}`,
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );

    return response.data.data as SponsorshipRequestType[];
  } catch (error) {
    console.error('Error fetching sponsorship request by event:', error);
    throw error;
  }
};

export const fetchSponsorshipRequestByEventAndStatus = async (
  id: number,
  status: string
) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sponsorship-requests/event/${id}/status/${status}`,
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );

    return response.data.data as SponsorshipRequestType[];
  } catch (error) {
    console.error(
      'Error fetching sponsorship request by event and status:',
      error
    );
    throw error;
  }
};

export const fetchSponReqWithNameByEvent = async (id: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sponsorship-requests/event/with-sponsor/${id}`,
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );

    return response.data.data as SponsorshipRequestType[];
  } catch (error) {
    console.error(
      'Error fetching sponsorship request with name by event:',
      error
    );
    throw error;
  }
};

export const updateSponsorshipRequestStatus = async (
  requestId: number,
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
) => {
  const id = String(requestId);

  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sponsorship-requests/${id}/status/${status}`,
      {},
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );

    console.log('Sponsorship request status updated:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error updating sponsorship request status:', error);
    throw error;
  }
};
