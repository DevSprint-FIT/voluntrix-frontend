'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import EventCreation from '@/components/UI/EventCreation';
import { EventType } from '@/types/EventType';
import { fetchEventByHostId } from '@/services/eventService';
import { useRouter } from 'next/navigation';

export default function HostEvents() {
  const [activeTab, setActiveTab] = useState('all');
  const [events, setEvents] = useState<EventType[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [eventCounts, setEventCounts] = useState({
    active: 0,
    pending: 0,
    completed: 0,
  });

  const router = useRouter();

  const handleRowClick = (eventId: string) => {
    router.push(`/EventHostWorkspace/${eventId}/tasks`);
  };

  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoading(true);
        const data = await fetchEventByHostId();
        console.log('Fetched data:', JSON.stringify(data, null, 2));

        setEvents(Array.isArray(data) ? data : []);

        const counts = {
          active: data.filter((e) => e.eventStatus.toUpperCase() === 'ACTIVE')
            .length,
          pending: data.filter((e) => e.eventStatus.toUpperCase() === 'PENDING')
            .length,
          completed: data.filter(
            (e) => e.eventStatus.toUpperCase() === 'COMPLETE'
          ).length,
          denied: data.filter(
            (e) => e.eventStatus.toUpperCase() === 'DENIED'
          ).length,
        };

        setEventCounts(counts);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to fetch events. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  const statsCards = [
    {
      title: 'Active Events',
      count: eventCounts.active.toString(),
      subtitle: 'Currently ongoing',
    },
    {
      title: 'Applied Events',
      count: eventCounts.pending.toString(),
      subtitle: 'Pending Approvals',
    },
    {
      title: 'Completed Events',
      count: eventCounts.completed.toString(),
      subtitle: 'Total completed',
    },
  ];

  const filteredEvents = Array.isArray(events)
    ? events.filter((event) => {
        const status = event.eventStatus.toUpperCase();
        if (activeTab === 'all') return true;
        if (activeTab === 'active') return status === 'ACTIVE';
        if (activeTab === 'applied') return status === 'PENDING';
        if (activeTab === 'completed') return status === 'COMPLETE';
        return false;
      })
    : [];

  const tabs = [
    { id: 'all', label: 'All Events', active: true },
    { id: 'active', label: 'Active Events', active: false },
    { id: 'applied', label: 'Applied Events', active: false },
    { id: 'completed', label: 'Completed Events', active: false },
    { id: 'denied', label: 'Denied Events', active: false },
  ];

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? 'st'
        : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
        ? 'rd'
        : 'th';

    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day.toString().padStart(2, '0')}${suffix} ${month} ${year}`;
  }

  function getStatusStyles(status: string) {
    switch (status.toUpperCase()) {
      case 'DRAFT':
        return 'bg-gray-200 text-gray-800'; // Neutral, work-in-progress
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700'; // Awaiting approval
      case 'ACTIVE':
        return 'bg-green-100 text-green-700'; // Ongoing event
      case 'COMPLETE':
        return 'bg-blue-100 text-blue-700'; // Successfully finished
      case 'DENIED':
        return 'bg-red-100 text-red-700'; // Rejected or not approved
      default:
        return 'bg-gray-100 text-gray-700'; // Fallback
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#029972] mx-auto mb-4"></div>
          <p className="text-[#B0B0B0] font-secondary">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4 font-secondary">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-verdant-600 text-white rounded-md hover:bg-verdant-700 transition-colors font-secondary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-9 py-4">
        <nav className="text-shark-300 mb-2 mt-3 font-secondary">
          Event Host / Events
        </nav>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 font-secondary">
            Events
          </h1>
          <EventCreation />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-9 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <div key={index} className="bg-shark-50/60 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-shark-800 font-bold mb-1">
                    {card.title}
                  </h3>
                  <div className="text-3xl font-bold text-verdant-600 mb-1">
                    {card.count}
                  </div>
                  <p className="text-shark-400 font-medium font-secondary text-sm">
                    {card.subtitle}
                  </p>
                </div>
                <Image
                  src="/icons/barchart-green.svg"
                  width={56}
                  height={56}
                  alt={card.title}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div>
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-md ${
                    activeTab === tab.id
                      ? 'border-verdant-500 text-verdant-600'
                      : 'border-transparent text-shark-500 hover:text-shark-700 hover:border-shark-300'
                  }`}
                >
                  {tab.label}

                  {tab.id === 'all' && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-verdant-600 rounded-full">
                      {events.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Events Table */}
        <div>
          <div className="px-6 py-5">
            <h2 className="text-2xl font-bold text-shark-900">
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-shark-200">
                <tr className="text-left text-md font-normal font-secondary text-shark-700 tracking-wider">
                  <th className="px-6 py-3">Event Name</th>
                  <th className="px-6 py-3">Start Date</th>
                  <th className="px-6 py-3">End Date</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">No of Volunteers</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        {activeTab === 'all' && events.length === 0 ? (
                          <>
                            <p className="text-shark-500 font-secondary text-lg">
                              Create your first event to get started.
                            </p>
                            <EventCreation />
                          </>
                        ) : (
                          <p className="text-shark-500 font-secondary text-lg">
                            No events found.
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event) => (
                    <tr
                      key={event.eventId}
                      className="hover:bg-shark-50 space-y-4 cursor-pointer"
                      onClick={() => handleRowClick(String(event.eventId))}
                    >
                      <td className="px-6 py-4 whitespace-nowrap rounded-l-lg">
                        <div className="text-md font-primary font-medium text-shark-900">
                          {event.eventTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-primary text-shark-900">
                        {formatDate(event.eventStartDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-primary text-shark-900">
                        {formatDate(event.eventEndDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-primary text-shark-900">
                        {event.eventLocation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-sm font-primary font-semibold rounded-full ${getStatusStyles(
                            event.eventStatus
                          )}`}
                        >
                          {event.eventStatus.charAt(0).toUpperCase() +
                            event.eventStatus.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="text-center px-6 py-4 whitespace-nowrap text-sm font-primary text-shark-900 rounded-r-lg">
                        {event.volunteerCount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
