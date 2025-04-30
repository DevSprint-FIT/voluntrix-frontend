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

export const fetchFilteredEvents = async (
  params: Record<string, string>
): Promise<EventType[]> => {
  try {
    const response = await axios.get<EventType[]>(
      'http://localhost:8080/api/public/v1/events/filter',
      { params }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const fetchSearchedEvents = async (
  searchText: string
): Promise<EventType[]> => {
  try {
    const response = await axios.get<EventType[]>(
      'http://localhost:8080/api/public/v1/events/search',
      { params: { query: searchText } }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const fetchEventTitles = async () => {
  try {
    const response = await axios.get(
      'http://localhost:8080/api/public/v1/events/names'
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};
