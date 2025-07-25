'use client';

import { use } from 'react';
import { useEffect, useState } from 'react';
import Event from '@/components/layout/events/Event';
import EventSection from '@/components/layout/events/EventSection';
import EventSkeleton from '@/components/UI/EventSkeleton';
import Breadcrumb from '@/components/UI/Breadcrumb';
import { fetchEventById } from '@/services/eventService';
import { EventType } from '@/types/EventType';
import { OrganizationType } from '@/types/OrganizationType';
import EventErrorDisplay from '@/components/UI/EventErrorDisplay';
import { fetchOrganizationById } from '@/services/organizationService';
import { fetchSponsorshipsByEvent } from '@/services/sponsorshipService';

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
  const [organization, setOrganization] = useState<OrganizationType | null>(
    null
  );
  const [sponsorships, setSponsorships] = useState<string[]>([]);

  useEffect(() => {
    if (isNaN(eventId)) {
      setError('Invalid event ID');
      setLoading(false);
      return;
    }

    const getEventAndOrganization = async () => {
      setLoading(true);
      setError(null);

      try {
        const eventData = await fetchEventById(eventId);

        if (!eventData) {
          setError('Event not found');
          return;
        }

        setEvent(eventData);

        if (
          eventData.organizationId !== null &&
          eventData.organizationId !== undefined
        ) {
          try {
            const orgData = await fetchOrganizationById(
              eventData.organizationId
            );
            if (!orgData) {
              setError('Organization not found');
              return;
            }
            setOrganization(orgData);
          } catch (orgErr) {
            if (orgErr instanceof Error) {
              setError(orgErr.message);
            } else {
              setError('Organization fetch failed.');
            }
          }
        }
        if (eventData.sponsorshipEnabled) {
          try {
            const sponsorshipData = await fetchSponsorshipsByEvent(eventId);
            const sponsorshipNames = sponsorshipData.map(
              (s) => s.sponsorshipName
            );
            setSponsorships(sponsorshipNames);
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

    getEventAndOrganization();
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
            sponsor={{ sponsorships }}
            organization={organization}
          />
          <EventSection
            title="Based on your browsing history"
            subTitle="Based on searches and preferences"
          />
        </>
      ) : null}
    </div>
  );
}
