import axios from 'axios';
import { EventType } from '@/types/EventType';
import { SponsorshipType } from '@/types/SponsorshipType';

export const fetchPublicFilteredEvents = async (
  params: Record<string, string>
): Promise<EventType[]> => {
  try {
    const response = await axios.get<EventType[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/events/filter-with-org`,
      {
        params,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching filtered events:', error);
    throw error;
  }
};

export const fetchPublicSearchedEvents = async (
  searchText: string
): Promise<EventType[]> => {
  try {
    const response = await axios.get<EventType[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/events/search-with-org`,
      {
        params: { query: searchText },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const fetchPublicEventTitles = async () => {
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

export const fetchSponsorshipsByEvent = async (
  eventId: number
): Promise<SponsorshipType[]> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/sponsorships/event/${eventId}`
    );

    return response.data.data;
  } catch (error) {
    console.error('Error fetching sponsorships by event:', error);
    throw error;
  }
};

export const fetchAllEvents = async (): Promise<EventType[]> => {
  try {
    const response = await axios.get<EventType[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/events/available/all`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
};
