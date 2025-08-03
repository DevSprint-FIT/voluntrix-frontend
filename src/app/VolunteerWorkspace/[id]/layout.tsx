"use client";

import VolunteerWorkspaceSidebar from "@/components/UI/VolunteerWorkspaceSidebar";
import EventHeader from "@/components/UI/EventHeader";
import React from "react";

export default function VolunteerWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);

  return (
    <div className="flex overflow-hidden">
      <VolunteerWorkspaceSidebar eventId={resolvedParams.id} />
      <div className="flex-1 ml-60 overflow-x-auto">
        <EventHeader eventId={resolvedParams.id} />
        <div className="p-6 min-w-0">{children}</div>
      </div>
    </div>
  );
}
