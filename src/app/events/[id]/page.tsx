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
import { fetchSponsorshipsByEvent } from '@/services/sponsorshipService';
import { SponsorshipType } from '@/types/SponsorshipType';

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
  const [sponsorships, setSponsorships] = useState<SponsorshipType[]>([]);
  const [sponsorshipNames, setSponsorshipNames] = useState<string[]>([]);

  useEffect(() => {
    if (isNaN(eventId)) {
      setError('Invalid event ID');
      setLoading(false);
      return;
    }

    const getEventAndSponsorships = async () => {
      setLoading(true);
      setError(null);

      try {
        const eventData = await fetchEventById(eventId);

        if (!eventData) {
          setError('Event not found');
          return;
        }

        setEvent(eventData);

        if (eventData.sponsorshipEnabled) {
          try {
            const sponsorshipData = await fetchSponsorshipsByEvent(eventId);
            const sponsorshipNames = sponsorshipData.map((s) => s.type);
            setSponsorships(sponsorshipData);
            setSponsorshipNames(sponsorshipNames);
          } catch (sponsErr) {
            console.error('Failed to fetch sponsorships:', sponsErr);
            setSponsorships([]);
          }
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

    getEventAndSponsorships();
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
          <Event
            event={event}
            sponsorshipNames={sponsorshipNames}
            sponsorships={sponsorships}
          />
          <EventSection
            title="Recommended Events for You"
            subTitle="Upcoming events tailored to your interests and availability."
          />
        </>
      ) : null}
    </div>
  );
}
