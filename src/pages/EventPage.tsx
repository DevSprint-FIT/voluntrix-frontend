'use client';

import FooterSection from '@/components/layout/FooterSection';
import GoToTop from '@/components/UI/GoToTop';
import Navbar from '@/components/UI/Navbar';
import Event from '@/components/layout/events/Event';
import EventSection from '@/components/layout/events/EventSection';
import { EventType } from '@/types/EventType';
import { useEffect, useState } from 'react';
import axios from 'axios';
import EventSkeleton from '@/components/UI/EventSkeleton';
import Breadcrumb from '@/components/UI/Breadcrumb';

const sponsorData = {
  sponsorships: [
    'Title Partner',
    'Platinum Partner',
    'Gold Partner',
    'Silver Partner',
  ],
};

export default function EventPage(/*{ params }: { params: { eventId: number } }*/) {
  const [event, setEvent] = useState<EventType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(
    () => {
      const fetchEventById = async () => {
        try {
          const response = await axios.get<EventType>(
            `http://localhost:8080/api/public/v1/events/1`
          );
          setEvent(response.data);
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

      fetchEventById();
    },
    [
      /*params.eventId*/
    ]
  );

  return (
    <div className="flex flex-col justify-center items-start flex-shrink-0">
      <Navbar />
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
      <FooterSection />
      <GoToTop />
    </div>
  );
}
