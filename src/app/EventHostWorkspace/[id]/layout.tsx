'use client';

import EventHostWorkspaceSidebar from '@/components/UI/EventHostWorkspaceSidebar';
import EventDropdownHeader from '@/components/UI/EventDropdownHeader';
import React, { useEffect, useState } from 'react';
import { fetchEventTitlesByHostId } from '@/services/eventService';

interface Event {
  eventId: string;
  eventTitle: string;
}

export default function EventHostWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const [events, setEvents] = useState<Event[]>([]);

  const resolvedParams = React.use(params);
  const hostId = 3; // Assuming hostId is 1 for this example

  useEffect(() => {
    const getEventsTitle = async (hostId: number) => {
      try {
        const data = await fetchEventTitlesByHostId(hostId);
        console.log('Fetched data:', JSON.stringify(data, null, 2));

        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching event titles:', err);
      }
    };

    getEventsTitle(hostId);
  }, [hostId]);

  const [selectedEvent, setSelectedEvent] = useState<Event>(events[0] || { eventId: '', eventTitle: '' });
  return (
    <div className="flex">
      <EventHostWorkspaceSidebar eventId={resolvedParams.id} />
      <div className="flex-1 ml-60">
        <EventDropdownHeader
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          events={events}
        />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
