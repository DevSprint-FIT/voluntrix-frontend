"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import EventStatusCard from "@/components/UI/EventStatusCard";
import { sponsorService, SponsorEventData } from "@/services/sponsorService";

const tabs = [
  { name: "Approved Sponsorships", href: "/Sponsor/events/active" },
  { name: "Pending Sponsorships", href: "/Sponsor/events/request" },
  { name: "Rejected Sponsorships", href: "/Sponsor/events/completed" },
];

interface EventStatusCounts {
  active: number;
  pending: number;
  completed: number;
}

interface Sponsor {
  id: string;
  name: string;
  company: string;
  imageUrl: string;
}

export default function SponsorEventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [counts, setCounts] = useState<EventStatusCounts | null>(null);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);

  const sponsorId = 1;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingCounts(true);

        const mockSponsor: Sponsor = {
          id: "sponsor-123",
          name: "John Doe",
          company: "TechCorp Solutions",
          imageUrl: "/images/default-profile.jpg",
        };
        setSponsor(mockSponsor);

        // Fetch real event data
        const eventData = await sponsorService.getAllSponsorEventData();

        // Calculate real counts using the same logic as your service
        const activeEvents = sponsorService.getActiveEvents(eventData);
        const pendingRequests = sponsorService.getPendingRequests(eventData);
        const completedEvents = sponsorService.getCompletedEvents(eventData);

        const realCounts: EventStatusCounts = {
          active: activeEvents.length,
          pending: pendingRequests.length,
          completed: completedEvents.length,
        };

        setCounts(realCounts);
        console.log("Event counts loaded:", realCounts);
      } catch (error) {
        console.error("Error loading event data:", error);

        // Fallback to show 0 counts if API fails
        setCounts({
          active: 0,
          pending: 0,
          completed: 0,
        });
      } finally {
        setLoadingCounts(false);
      }
    };

    loadData();
  }, [sponsorId]);

  return (
    <div className="p-4">
      {/* Title with Sponsor Info */}
      <div className="flex justify-between items-center mb-4 px-4">
        {/* Left Side: Title */}
        <div>
          <p className="text-shark-300">Sponsor / Events</p>
          <h1 className="text-2xl font-primary font-bold">Events</h1>
        </div>

        {/* Right Side: Sponsor Info */}
        <div className="flex items-center gap-3">
          <img
            src={sponsor?.imageUrl}
            alt="Sponsor Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold font-secondary text-xl leading-tight">
              {sponsor?.name}
            </h2>
            <p className="font-secondary font-semibold text-shark-600 text-xs leading-tight">
              {sponsor?.company}
            </p>
          </div>
        </div>
      </div>

      {/* Event Status Cards */}
      <div className="flex gap-8 mb-8 justify-start">
        <EventStatusCard
          count={counts?.active}
          loading={loadingCounts}
          label="Approved Sponsorships"
          subtext="Currently sponsoring"
        />
        <EventStatusCard
          count={counts?.pending}
          loading={loadingCounts}
          label="Pending Sponsorships"
          subtext="Pending sponsorships"
        />
        <EventStatusCard
          count={counts?.completed}
          loading={loadingCounts}
          label="Rejected Sponsorships"
          subtext="Unsuccessful sponsorships"
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
      <div className="py-8">{children}</div>
    </div>
  );
}
