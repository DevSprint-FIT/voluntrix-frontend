import VolunteerSidebar from "@/components/UI/VolunteerSidebar";
import React from "react";

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <VolunteerSidebar />
      <div className="flex-1 p-6 ml-60">{children}</div>
    </div>
  );
}
