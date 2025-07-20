'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import EventCreation from '@/components/UI/EventCreation';
import { EventType } from '@/types/EventType';
import { fetchEventByHostId } from '@/services/eventService';
import { a } from 'framer-motion/client';

export default function HostEvents() {
  const [activeTab, setActiveTab] = useState('all');
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    const getEvents = async () => {
      setEvents(await fetchEventByHostId(3)); // Replace with actual host ID
    };

    getEvents();
  }, []);

  const statsCards = [
    {
      title: 'Active Events',
      count: '24',
      subtitle: 'Currently ongoing',
    },
    {
      title: 'Applied Events',
      count: '12',
      subtitle: 'Pending Approvals',
    },
    {
      title: 'Completed Events',
      count: '156',
      subtitle: 'Total completed',
    },
  ];

  const tabs = [
    { id: 'all', label: 'All Events', active: true },
    { id: 'active', label: 'Active Events', active: false },
    { id: 'applied', label: 'Applied Events', active: false },
    { id: 'completed', label: 'Completed Events', active: false },
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
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Events Table */}
        <div>
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold text-shark-900">
              {tabs.find(tab => tab.id === activeTab)?.label}
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
                {events &&
                  events.map((event) => (
                    <tr
                      key={event.eventId}
                      className="hover:bg-shark-50 space-y-4 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap rounded-l-lg">
                        <div>
                          <div className="text-md font-primary font-medium text-shark-900">
                            {event.eventTitle}
                          </div>
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
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
