import axios from 'axios';
import { EventApplicationCreateType } from '@/types/EventApplicationType';

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
