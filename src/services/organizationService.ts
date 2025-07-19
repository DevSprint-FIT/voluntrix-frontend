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
