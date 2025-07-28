import { OrganizationType } from '@/types/OrganizationType';
import axios from 'axios';

export const fetchOrganizationTitles = async () => {
  try {
    const response = await axios.get(
      'http://localhost:8080/api/public/organizations/names'
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const fetchOrganizationById = async (
  id: number
): Promise<OrganizationType> => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/public/organizations/${id}`
    );

    return response.data.data;
  } catch (error) {
    console.error('Error fetching organization by ID:', error);
    throw error;
  }
};

export type Organization = {
  id: number;
  name: string;
  institute: string;
  imageUrl: string;
};

export const getOrganizationById = async (
  orgId: number
): Promise<Organization> => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/public/organizations/${orgId}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch organization: ${response.status}`);
    }
    const responseBody = await response.json();
    return responseBody.data as Organization;
  } catch (error) {
    console.error("Error fetching organization:", error);
    throw error;
  }
};
