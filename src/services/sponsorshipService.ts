import axios from 'axios';
import { SponsorshipType } from '@/types/SponsorshipType';
import { SponsorshipCreateType } from '@/types/SponsorshipCreateType';
import authService from '@/services/authService';

export const createSponsorships = async (data: SponsorshipCreateType) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sponsorships`,
      data,
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );

    console.log('Sponsorship created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating sponsorship:', error);
    throw error;
  }
};

export const fetchSponsorshipsByEvent = async (
  eventId: number
): Promise<SponsorshipType[]> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sponsorships/event/${eventId}`,
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Error fetching sponsorships by event:', error);
    throw error;
  }
};
