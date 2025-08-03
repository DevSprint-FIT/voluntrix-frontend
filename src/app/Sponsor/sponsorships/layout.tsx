"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import EventStatusCard from "@/components/UI/EventStatusCard";
import { sponsorService, SponsorProfile } from "@/services/sponsorService";

const tabs = [
  { name: "Approved Sponsorships", href: "/Sponsor/sponsorships/approved" },
  { name: "Pending Sponsorships", href: "/Sponsor/sponsorships/requested" },
  { name: "Rejected Sponsorships", href: "/Sponsor/sponsorships/rejected" },
];

interface EventStatusCounts {
  approved: number;
  pending: number;
  rejected: number;
}

export default function SponsorEventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [counts, setCounts] = useState<EventStatusCounts | null>(null);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [sponsor, setSponsor] = useState<SponsorProfile | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingCounts(true);

        // Fetch real sponsor profile data
        const sponsorProfile = await sponsorService.getSponsorProfile();
        setSponsor(sponsorProfile);

        // Fetch real sponsorship request counts
        const realCounts = await sponsorService.getSponsorshipRequestCounts();
        setCounts(realCounts);

        console.log("Sponsorship request counts loaded:", realCounts);
      } catch (error) {
        console.error("Error loading sponsorship data:", error);

        // Fallback to show 0 counts if API fails
        setCounts({
          approved: 0,
          pending: 0,
          rejected: 0,
        });
      } finally {
        setLoadingCounts(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="p-4">
      {/* Title with Sponsor Info */}
      <div className="flex justify-between items-center mb-4 px-4">
        {/* Left Side: Title */}
        <div>
          <p className="text-shark-300">Sponsor / Sponsorships</p>
          <h1 className="text-2xl font-primary font-bold">Sponsorships</h1>
        </div>

        {/* Right Side: Sponsor Info */}
        <div className="flex items-center gap-3">
          <img
            src={sponsor?.imageUrl || "/images/default-profile.jpg"}
            alt="Sponsor Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold font-secondary text-xl leading-tight">
              {sponsor?.name || "Loading..."}
            </h2>
            <p className="font-secondary font-semibold text-shark-600 text-xs leading-tight">
              {sponsor?.company || "Loading..."}
            </p>
          </div>
        </div>
      </div>

      {/* Event Status Cards */}
      <div className="flex gap-8 mb-8 mt-10 justify-start">
        <EventStatusCard
          count={counts?.approved}
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
          count={counts?.rejected}
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
