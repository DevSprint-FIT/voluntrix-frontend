'use client';

import Event from '@/components/layout/events/Event';
import EventSection from '@/components/layout/events/EventSection';
import { EventType } from '@/types/EventType';
import { useEffect, useState } from 'react';
import EventSkeleton from '@/components/UI/EventSkeleton';
import Breadcrumb from '@/components/UI/Breadcrumb';
import { fetchEventById } from '@/services/eventService';

const sponsorData = {
  sponsorships: [
    'Title Partner',
    'Platinum Partner',
    'Gold Partner',
    'Silver Partner',
  ],
};

export default function EventPage({ params }: { params: { eventId: number } }) {
  const [event, setEvent] = useState<EventType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getEvent = async () => {
      try {
        const eventData = await fetchEventById(1);
        setEvent(eventData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    getEvent();
  }, [params.eventId]);

  return (
    <div className="flex flex-col justify-center items-start flex-shrink-0">
      <Breadcrumb />
      {loading ? (
        <EventSkeleton />
      ) : error ? (
        <div className="text-center w-full py-10 text-red-500"></div>
      ) : event ? (
        <Event event={event} sponsor={sponsorData} />
      ) : null}
      <EventSection
        title={'Based on your browsing history'}
        subTitle={'Based on searches and prefernces'}
      />
    </div>
  );
}
