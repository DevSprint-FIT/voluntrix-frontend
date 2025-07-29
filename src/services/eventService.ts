import axios from 'axios';
import { EventType } from '@/types/EventType';
import { EventCreateType } from '@/types/EventCreateType';

export const fetchEventById = async (id: number): Promise<EventType> => {
  try {
    const response = await axios.get<EventType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/events/with-org/${id}`
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
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/events/filter-with-org`,
      { params }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching filtered events:', error);
    throw error;
  }
};

export const fetchSearchedEvents = async (
  searchText: string
): Promise<EventType[]> => {
  try {
    const response = await axios.get<EventType[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/events/search-with-org`,
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
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/events/names`
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const createEvent = async (eventData: EventCreateType) => {
  // const token = 'mock-token-for-testing'; // authentication token

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/events`,
      eventData,
      {
        headers: {
          // Authorization: `Bearer ${token}`,
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
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/events/host/${id}`
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
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/events`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
};

export const fetchLatestEvents = async (): Promise<EventType[]> => {
  try {
    const response = await axios.get<EventType[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/events/latest-three`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
};

export const fetchRecommendedEvents = async (
  id: number
): Promise<EventType[]> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/events/recommended/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
};

export const fetchEventTitlesByHostId = async (hostId: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/events/names/${hostId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching event titles:', error);
    throw error;
  }
};
