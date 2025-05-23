'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import EventStatusCard from "@/components/UI/EventStatusCard";
import { EventStatusCounts, getEventStatusCounts } from "@/services/eventStatsService";
import { getOrganizationById, Organization } from "@/services/organizationService";

const tabs = [
  { name: "Active Events", href: "/Organization/events/active" },
  { name: "Event Requests", href: "/Organization/events/requests" },
  { name: "Completed Events", href: "/Organization/events/completed" },
];

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [counts, setCounts] = useState<EventStatusCounts | null>(null);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const orgId = 1; // Replace with actual org ID

  useEffect(() => {
    const getCounts = async () => {
      try {
        const data = await getEventStatusCounts(orgId);
        setCounts(data);
      } catch (error) {
        console.error("Failed to fetch event counts:", error);
      } finally {
        setLoadingCounts(false);
      }
    };

    const fetchOrganization = async () => {
      try {
        const data = await getOrganizationById(orgId);
        setOrganization(data);
      } catch (error) {
        console.error("Failed to fetch organization:", error);
      }
    };

    getCounts();
    fetchOrganization();
  }, [orgId]);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">

      {/* Title with Organization Info */}
      <div className="flex justify-between items-center mb-4 px-4">
      {/* Left Side: Title */}
        <div>
           <p className="text-shark-300">Organization / Events</p>
           <h1 className="text-2xl font-primary font-bold">Events</h1>
        </div>

      {/* Right Side: Organization Info */}
         <div className="flex items-center gap-3">
           <img
             src={organization?.imageUrl} 
             alt="Organization Logo"
             className="w-10 h-10 rounded-full object-cover"
           />
         <div>
           <h2 className="font-semibold font-secondary text-xl leading-tight">{organization?.name}</h2> 
           <p className="font-secondary font-semibold text-shark-600 text-xs leading-tight">{organization?.institute}</p>       
         </div>
       </div>
    </div>


      {/* Event Status Cards */}
      <div className="flex gap-8 mb-8 justify-start">
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

        {/* Pagination 
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, 3))}
            className="h-8 w-8 rounded-lg bg-shark-100 text-shark-900 hover:bg-shark-200"
          >
            {">"}
          </button>
        </div>
        */}
      </div>

    </div>
  );
}
