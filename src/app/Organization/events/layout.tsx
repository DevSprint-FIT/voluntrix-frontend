
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import EventStatusCard from "@/components/UI/EventStatusCard";
import { EventStatusCounts, getEventStatusCounts } from "@/services/eventStatsService";
import { getOrganizationByToken, Organization } from "@/services/organizationService";

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [counts, setCounts] = useState<EventStatusCounts | null>(null);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);

  
  const tabs = [
    { name: "Active Events", href: `/Organization/events/active` },
    { name: "Event Requests", href: `/Organization/events/requests` },
    { name: "Completed Events", href: `/Organization/events/completed` },
  ];

  useEffect(() => {
    const getCounts = async () => {
      try {
        const data = await getEventStatusCounts();
        setCounts(data);
      } catch (error) {
        console.error("Failed to fetch event counts:", error);
      } finally {
        setLoadingCounts(false);
      }
    };

    const fetchOrganization = async () => {
      try {
        const data = await getOrganizationByToken();
        setOrganization(data);
      } catch (error) {
        console.error("Failed to fetch organization:", error);
      }
    };

    getCounts();
    fetchOrganization();
  }, []);

  return (
    <div className="p-4 w-full max-w-full overflow-x-hidden">
      {/* Title with Organization Info */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 px-4 gap-4">
        {/* Left Side: Title */}
        <div className="min-w-0 flex-shrink">
           <p className="text-shark-300">Organization / Events</p>
           <h1 className="text-2xl font-primary font-bold">Events</h1>
        </div>

        {/* Right Side: Organization Info */}
        <div className="flex items-center gap-3 flex-shrink-0">
           <img
             src={organization?.imageUrl} 
             alt="Organization Logo"
             className="w-10 h-10 rounded-full object-cover flex-shrink-0"
           />
           <div className="min-w-0">
             <h2 className="font-semibold font-secondary text-xl leading-tight truncate">{organization?.name}</h2> 
             <p className="font-secondary font-semibold text-shark-600 text-xs leading-tight truncate">{organization?.institute}</p>       
           </div>
        </div>
      </div>

      {/* Event Status Cards - Fixed Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <EventStatusCard 
          count={counts?.active}
          loading={loadingCounts}
          label="Active Events" 
          subtext="Currently ongoing" 
        />
        <EventStatusCard 
          count={counts?.pending}
          loading={loadingCounts}
          label="Event Requests" 
          subtext="Pending approval" 
        />
        <EventStatusCard 
          count={counts?.completed}
          loading={loadingCounts}
          label="Completed Events" 
          subtext="Total completed" 
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-shark-100 mb-4 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`pb-2 whitespace-nowrap flex-shrink-0 ${
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
      </div>
    </div>
  );
}
