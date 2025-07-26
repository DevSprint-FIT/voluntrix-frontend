"use client";

import EventHostWorkspaceSidebar from "@/components/UI/EventHostWorkspaceSidebar";
import EventDropdownHeader from "@/components/UI/EventDropdownHeader";
import React, { useState } from "react";

interface Event {
  id: string;
  name: string;
}

export default function EventHostWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedEvent, setSelectedEvent] = useState<Event>({
    id: "1",
    name: "Community Clean-up Drive",
  });

  const events: Event[] = [
    { id: "1", name: "Community Clean-up Drive" },
    { id: "2", name: "Food Distribution Program" },
    { id: "3", name: "Tree Planting Initiative" },
    { id: "4", name: "Elder Care Support" },
    { id: "5", name: "Educational Workshop" },
  ];

  return (
    <div className="flex">
      <EventHostWorkspaceSidebar />
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
