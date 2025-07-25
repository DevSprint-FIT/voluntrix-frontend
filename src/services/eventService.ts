import axios from 'axios';
import { EventType } from '@/types/EventType';
import { EventCreateType } from '@/types/EventCreateType';

export const fetchEventById = async (id: number): Promise<EventType> => {
  try {
    const response = await axios.get<EventType>(
      `http://localhost:8080/api/public/events/with-org/${id}`
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
      'http://localhost:8080/api/public/events/filter-with-org',
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
      'http://localhost:8080/api/public/events/search-with-org',
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
      'http://localhost:8080/api/public/events/names'
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const createEvent = async (eventData: EventCreateType) => {
  const token = localStorage.getItem('token'); // authentication token

  try {
    const response = await axios.post(
      'http://localhost:8080/api/public/events',
      eventData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const fetchEventByHostId = async (id: number): Promise<EventType[]> => {
  try {
    const response = await axios.get<EventType[]>(
      `http://localhost:8080/api/public/events/host/${id}`
    );
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    } else {
      console.warn('Unexpected response format:', data);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return [];
  }
};

export const fetchAllEvents = async (): Promise<EventType[]> => {
  try {
    const response = await axios.get<EventType[]>(
      'http://localhost:8080/api/public/events'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
};
