import axios from 'axios';
import { EventType } from '@/types/EventType';
import { EventCreateType } from '@/types/EventCreateType';
import authService from '@/services/authService';

export const fetchEventById = async (id: number): Promise<EventType> => {
  try {
    const response = await axios.get<EventType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/with-org/${id}`,
      {
        headers: authService.getAuthHeadersAxios(),
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
  try {
    const response = await axios.get<EventType[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/filter-with-org`,
      {
        params,
        headers: authService.getAuthHeadersAxios(),
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
  try {
    const response = await axios.get<EventType[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/search-with-org`,
      {
        params: { query: searchText },
        headers: authService.getAuthHeadersAxios(),
      }
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
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/names`,
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const createEvent = async (eventData: EventCreateType) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events`,
      eventData,
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const fetchEventByHostId = async (): Promise<EventType[]> => {
  try {
    const response = await axios.get<EventType[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/host`,
      {
        headers: authService.getAuthHeadersAxios(),
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
  try {
    const response = await axios.get<EventType[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/events/all`,
      {
        headers: authService.getAuthHeadersAxios(),
      }
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
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/latest-three`,
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
};

export const fetchRecommendedEvents = async (): Promise<EventType[]> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/recommended`,
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
};

export const fetchEventTitlesByHostId = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/names`,
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching event titles:', error);
    throw error;
  }
};

export const recruitVolunteer = async (eventId: number) => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/recruit-volunteer/${eventId}`,
      {},
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error recruiting volunteer:', error);
    throw error;
  }
};

export const fetchTotalEventsCountByHostId = async (): Promise<number> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/total-events-count`,
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching event count:', error);
    throw error;
  }
};

export const fetchTotalEventHostRewardPoints = async (): Promise<number> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/total-event-host-reward-points`,
      {
        headers: authService.getAuthHeadersAxios(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching total event host reward points:', error);
    throw error;
  }
};
