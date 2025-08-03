'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import EventStatusCard from '@/components/UI/EventStatusCard';
import {
  VolunteerEventCounts,
  getVolunteerEventCounts,
} from '@/services/volunteerEventStatsService';
import {
  ActiveEvent,
  getVolunteerActiveEvents,
} from '@/services/volunteerEventService';
import {} from '@/services/volunteerEventService';
import authService from '@/services/authService';
import ProfileIndicator from '@/components/UI/ProfileIndicator';
import VolDropdownHeader from '@/components/UI/VolDropdownHeader';

const tabs = [
  { name: 'Active Events', href: '/Volunteer/events/active' },
  { name: 'Applied Events', href: '/Volunteer/events/applied' },
  { name: 'Completed Events', href: '/Volunteer/events/completed' },
];

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [counts, setCounts] = useState<VolunteerEventCounts | null>(null);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [events, setEvents] = useState<ActiveEvent[]>([]);

  useEffect(() => {
    const checkAuthAndFetchCounts = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.replace('/auth/login');
          return;
        }

        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          router.replace('/auth/login');
          return;
        }

        // Check if profile is completed
        if (!currentUser.profileCompleted) {
          router.replace('/auth/profile-form?type=volunteer');
          return;
        }

        setIsAuthenticated(true);

        // Fetch event counts
        const data = await getVolunteerEventCounts();
        setCounts(data);

        // Fetch active events
        const fetchedEvents = await getVolunteerActiveEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Failed to fetch event counts:', error);
        // If authentication fails, redirect to login
        if (error instanceof Error && error.message.includes('401')) {
          router.replace('/auth/login');
          return;
        }
      } finally {
        setLoadingCounts(false);
      }
    };

    checkAuthAndFetchCounts();
  }, [router]);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Show loading while checking authentication
  if (!isAuthenticated && loadingCounts) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#029972] mx-auto mb-4"></div>
          <p className="text-gray-600 font-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-4">
      {/* Title */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-shark-300">Volunteer / Events</span>
          <h1 className="text-2xl font-primary font-bold">Events</h1>
        </div>
        <ProfileIndicator />
      </div>

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
      <div className="flex justify-between items-center">
        <div className="flex gap-6 border-b border-shark-100 mb-4">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`pb-2 ${
                  isActive
                    ? 'border-b-2 border-verdant-600 text-verdant-600 font-semibold'
                    : 'border-b-2 border-transparent text-shark-300'
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>
        <VolDropdownHeader events={events}/>
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
            {'<'}
          </button>

          {[1, 2, 3].map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              className={`h-8 w-8 rounded-lg ${
                currentPage === pageNumber
                  ? 'bg-verdant-400 text-white'
                  : 'bg-shark-100 text-shark-900 hover:bg-shark-200'
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, 3))}
            className="h-8 w-8 rounded-lg bg-shark-100 text-shark-900 hover:bg-shark-200"
          >
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
}
