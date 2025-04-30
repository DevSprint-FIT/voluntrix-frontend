import axios from 'axios';
import { EventType } from '@/types/EventType';

export const fetchEventById = async (id: number): Promise<EventType> => {
  try {
    const response = await axios.get<EventType>(
      `http://localhost:8080/api/public/v1/events/${id}`
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};
