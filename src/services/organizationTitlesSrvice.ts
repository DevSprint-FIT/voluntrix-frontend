import { OrganizationTitles } from '@/types/OrganizationTitles';
import axios from 'axios';

export const fetchOrganizationTitles = async (): Promise<OrganizationTitles[]> => {
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/organizations/names`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching organization titles:', error);
    throw error;
  }
};
