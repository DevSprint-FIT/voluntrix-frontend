import EventHostSidebar from "@/components/UI/EventHostSidebar";
import React from "react";

export default function EventHostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <EventHostSidebar />
      <div className="flex-1 p-6 ml-60">{children}</div>
    </div>
  );
}
