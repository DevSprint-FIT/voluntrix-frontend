import Sidebar from "@/components/UI/Sidebar";
import React from "react";

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 ml-5">{children}</div>
    </div>
  );
}
