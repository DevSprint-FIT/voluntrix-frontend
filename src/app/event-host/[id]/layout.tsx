import EventHostSidebar from "@/components/UI/EventHostSidebar";
import React from "react";

export default function EventHostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <div className="flex">
      <EventHostSidebar hostId={params.id} />
      <div className="flex-1 p-6 ml-60">{children}</div>
    </div>
  );
}
