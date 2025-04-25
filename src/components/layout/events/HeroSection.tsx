'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '@/components/UI/Breadcrumb';
import FilterSection from '@/components/UI/FilterSection';
import Searchbar from '@/components/UI/Searchbar';
import EventList from './EventList';
import { EventType } from '@/types/EventType';

export default function HeroSection() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    province: '',
    district: '',
    categories: [] as { id: number; name: string }[],
    privateSelected: false,
    publicSelected: false,
  });

  useEffect(() => {
    const fetchFilteredEvents = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<EventType[]>(
          'http://localhost:8080/api/public/v1/events/filter',
          {
            params: {
              startDate: filters.startDate,
              endDate: filters.endDate,
              eventVisibility: filters.publicSelected
                ? 'PUBLIC'
                : filters.privateSelected
                ? 'PRIVATE'
                : '',
              categoryIds: filters.categories.map((c) => c.id).join(','),
            },
          }
        );

        setEvents(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while fetching events.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredEvents();
  }, [filters]);

  return (
    <div className="w-full flex flex-col items-center justify-start mt-32 mb-16">
      <div className="w-[1200px] flex flex-col items-center justify-start">
        <Breadcrumb />
        <div className="w-[806px] h-[230px] mt-16 flex flex-col items-center justify-start">
          <p className="font-primary text-shark-950 font-medium text-[44px]">
            <span className="text-verdant-600">Join</span> Meaningful
            <span className="text-verdant-600"> Events</span>
          </p>
          <p className="font-primary text-shark-950 font-medium text-[44px]">
            and <span className="text-verdant-600">Contribute </span>
            to the Community
          </p>
          <p className="font-secondary text-shark-700 text-lg mt-4">
            Discover events that match your passion and make a difference
          </p>
        </div>
        <div className="relative w-[806px] flex gap-6 rounded-10">
          <div className="w-[639px] relative">
            <Searchbar filters={filters} />
          </div>
          <FilterSection filters={filters} setFilters={setFilters} />
        </div>
      </div>
      <EventList events={events} loading={loading} error={error} />
    </div>
  );
}
