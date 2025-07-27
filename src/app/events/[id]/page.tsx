'use client';

import { use } from 'react';
import { useEffect, useState } from 'react';
import Event from '@/components/layout/events/Event';
import EventSection from '@/components/layout/events/EventSection';
import EventSkeleton from '@/components/UI/EventSkeleton';
import Breadcrumb from '@/components/UI/Breadcrumb';
import { fetchEventById } from '@/services/eventService';
import { EventType } from '@/types/EventType';
import EventErrorDisplay from '@/components/UI/EventErrorDisplay';

const sponsorData = {
  sponsorships: [
    'Title Partner',
    'Platinum Partner',
    'Gold Partner',
    'Silver Partner',
  ],
};

export default function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const eventId = Number(id);

  const [event, setEvent] = useState<EventType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isNaN(eventId)) {
      setError('Invalid event ID');
      setLoading(false);
      return;
    }

    const getEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const eventData = await fetchEventById(eventId);
        if (eventData) {
          setEvent(eventData);
        } else {
          setError('Event not found');
        }
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
  }, [eventId]);

  return (
    <div className="flex flex-col justify-start items-center flex-shrink-0">
      <Breadcrumb />

      {loading ? (
        <EventSkeleton />
      ) : error ? (
        <div className="mb-20">
          <EventErrorDisplay error={error} />
        </div>
      ) : event ? (
        <>
          <Event event={event} sponsor={sponsorData} />
          <EventSection
            title="Based on your browsing history"
            subTitle="Based on searches and preferences"
          />
        </>
      ) : null}
    </div>
  );
}
