"use client";

import EventHostWorkspaceSidebar from "@/components/UI/EventHostWorkspaceSidebar";
import EventHeader from "@/components/UI/EventHeader";
import React from "react";

export default function EventHostWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);

  return (
    <div className="flex">
      <EventHostWorkspaceSidebar eventId={resolvedParams.id} />
      <div className="flex-1 ml-60">
        <EventHeader eventId={resolvedParams.id} />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
