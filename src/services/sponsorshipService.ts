import axios from 'axios';
import { SponsorshipType } from '@/types/SponsorshipType';

export const createSponsorships = async (data: SponsorshipType) => {
  const token = localStorage.getItem('token'); // authentication token

  try {
    const response = await axios.post(
      'http://localhost:8080/api/public/sponsorships',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Sponsorship created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating sponsorship:', error);
    throw error;
  }
};

export const fetchSponsorshipsByEvent = async (eventId: number): Promise<SponsorshipType[]> => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/public/sponsorships/event/${eventId}`
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching sponsorships by event:', error);
    throw error;
  }
};
