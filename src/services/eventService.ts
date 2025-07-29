import axios from 'axios';
import { EventType } from '@/types/EventType';
import { EventCreateType } from '@/types/EventCreateType';

export const fetchEventById = async (id: number): Promise<EventType> => {
  // authentication token
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

  try {
    const response = await axios.get<EventType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/with-org/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
  // authentication token
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

  try {
    const response = await axios.get<EventType[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/filter-with-org`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
  // authentication token
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

  try {
    const response = await axios.get<EventType[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/search-with-org`,
      {
        params: { query: searchText },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const fetchEventTitles = async () => {
  // authentication token
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/names`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const createEvent = async (eventData: EventCreateType) => {
  // authentication token
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events`,
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

export const fetchEventByHostId = async (): Promise<EventType[]> => {
  // authentication token
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

  try {
    const response = await axios.get<EventType[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/host/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
  // authentication token
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

  try {
    const response = await axios.get<EventType[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/events/all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
};

export const fetchLatestEvents = async (): Promise<EventType[]> => {
  // authentication token
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

  try {
    const response = await axios.get<EventType[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/latest-three`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
};

export const fetchRecommendedEvents = async (): Promise<EventType[]> => {
  // authentication token
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/recommended`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
};

export const fetchEventTitlesByHostId = async () => {
  // authentication token
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/names`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching event titles:', error);
    throw error;
  }
};
