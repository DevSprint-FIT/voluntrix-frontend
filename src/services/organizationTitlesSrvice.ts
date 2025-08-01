import { OrganizationTitles } from '@/types/OrganizationTitles';
import axios from 'axios';
import authService from '@/services/authService';

export const fetchOrganizationTitles = async (): Promise<
  OrganizationTitles[]
> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/organizations/names`,
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching organization titles:', error);
    throw error;
  }
};
