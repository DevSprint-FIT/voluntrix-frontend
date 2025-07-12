"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import EventStatusCard from "@/components/UI/EventStatusCard";
import {
  VolunteerEventCounts,
  getVolunteerEventCounts,
} from "@/services/volunteerEventStatsService";

const tabs = [
  { name: "Active Events", href: "/Volunteer/events/active" },
  { name: "Applied Events", href: "/Volunteer/events/applied" },
  { name: "Completed Events", href: "/Volunteer/events/completed" },
];

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [counts, setCounts] = useState<VolunteerEventCounts | null>(null);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const volunteerId = 1; // Replace with actual volunteer ID

  useEffect(() => {
    const getCounts = async () => {
      try {
        const data = await getVolunteerEventCounts(volunteerId);
        setCounts(data);
      } catch (error) {
        console.error("Failed to fetch event counts:", error);
      } finally {
        setLoadingCounts(false);
      }
    };

    getCounts();
  }, [volunteerId]);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
      {/* Title */}
      <span className="text-shark-300">Volunteer / Events</span>
      <h1 className="text-2xl font-primary font-bold mb-4">Events</h1>

      {/* Event Status Cards */}
      <div className="flex gap-8 mb-8 justify-start">
        <EventStatusCard
          count={counts?.activeCount}
          loading={loadingCounts}
          label="Active Events"
          subtext="Currently participating"
        />
        <EventStatusCard
          count={counts?.appliedCount}
          loading={loadingCounts}
          label="Applied Events"
          subtext="Waiting for response"
        />
        <EventStatusCard
          count={counts?.completedCount}
          loading={loadingCounts}
          label="Completed Events"
          subtext="Total completed"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-shark-100 mb-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`pb-2 ${
                isActive
                  ? "border-b-2 border-verdant-600 text-verdant-600 font-semibold"
                  : "border-b-2 border-transparent text-shark-300"
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="py-8">
        {children}

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="h-8 w-8 rounded-lg bg-shark-100 text-shark-900 hover:bg-shark-200"
          >
            {"<"}
          </button>

          {[1, 2, 3].map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              className={`h-8 w-8 rounded-lg ${
                currentPage === pageNumber
                  ? "bg-verdant-400 text-white"
                  : "bg-shark-100 text-shark-900 hover:bg-shark-200"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, 3))}
            className="h-8 w-8 rounded-lg bg-shark-100 text-shark-900 hover:bg-shark-200"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
