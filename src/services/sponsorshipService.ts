import axios from 'axios';
import { SponsorshipType } from '@/types/SponsorshipType';

export const CreateSponsorships = async (data: SponsorshipType) => {
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
