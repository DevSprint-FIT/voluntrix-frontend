'use client';

import VolunteerWorkspaceSidebar from '@/components/UI/VolunteerWorkspaceSidebar';
// import EventDropdownHeader from '@/components/UI/EventDropdownHeader';
import React from 'react';

// interface Event {
//   id: string;
//   name: string;
// }

export default function VolunteerWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  // const [selectedEvent, setSelectedEvent] = useState<Event>({
  //   id: '1',
  //   name: 'Community Clean-up Drive',
  // });

  const resolvedParams = React.use(params);

  // const events: Event[] = [
  //   { id: '1', name: 'Community Clean-up Drive' },
  //   { id: '2', name: 'Food Distribution Program' },
  //   { id: '3', name: 'Tree Planting Initiative' },
  //   { id: '4', name: 'Elder Care Support' },
  //   { id: '5', name: 'Educational Workshop' },
  // ];

  return (
    <div className="flex">
      <VolunteerWorkspaceSidebar eventId={resolvedParams.id} />
      <div className="flex-1 ml-60">
        {/* <EventDropdownHeader
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          events={events}
        /> */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
