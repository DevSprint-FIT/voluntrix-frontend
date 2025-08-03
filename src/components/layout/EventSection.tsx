'use client';

import EventCard from '../UI/EventCard';
import EventCardSkeleton from '../UI/EventCardSkeleton';
import EventErrorDisplay from '../UI/EventErrorDisplay';
import Image from 'next/image';
import { EventType } from '@/types/EventType';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchLatestEvents } from '@/services/eventService';
import authService from '@/services/authService';

export default function EventSection() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const getLatestEvents = async () => {
      try {
        const eventsData = await fetchLatestEvents();
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching latest events:', err);
        setError('Failed to fetch latest events.');
      } finally {
        setIsLoading(false);
      }
    };

    getLatestEvents();
  }, []);

  const handleNavigate = () => {
    const path = authService.isAuthenticated() ? '/events' : '/public/events';
    router.push(path);
  };

  return (
    <div className="w-full flex items-start justify-center mt-24">
      <div className="w-[1054px] flex flex-col justify-center text-center">
        <div className="font-primary font-medium text-[2.5rem] text-shark-950">
          Stay Updated with the Latest Events
        </div>
        <div className="font-secondary text-lg text-shark-600 mt-6">
          Discover upcoming opportunities and see what organizations are
          planning. From local clean-ups to global initiatives, stay connected
          and never miss a chance to make an impact.
        </div>

        <div className="mt-16 flex flex-col gap-9">
          {isLoading && (
            <div className="flex gap-[65px]">
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </div>
          )}

          {error && <EventErrorDisplay error={error} />}

          <div className="flex gap-[65px]">
            {!isLoading &&
              !error &&
              events
                .slice(0, 3)
                .map((event) => (
                  <EventCard key={event.eventId} event={event} />
                ))}
          </div>
          <div
            className="flex gap-1 justify-end cursor-pointer"
            onClick={handleNavigate}
          >
            <p className="text-verdant-600 font-[500]">Explore More Events</p>
            <Image
              src="/icons/arrow-green.svg"
              width={24}
              height={24}
              alt="arrow-green"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
