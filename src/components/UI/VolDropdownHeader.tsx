'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ActiveEvent } from '@/services/volunteerEventService';

interface VolDropdownHeader {
  events: ActiveEvent[];
}

export default function VolDropdownHeader({
  events,
}: VolDropdownHeader) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const handleClick = (eventId: string) => {
    router.push(`/VolunteerWorkspace/${eventId}/tasks`);
  };

  return (
    <>
      {/* Event Dropdown Header */}
      <div className="z-20">
        <div className="relative inline-block">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between space-x-2 bg-verdant-100 w-60 hover:bg-verdant-200 px-4 py-2 rounded-lg border border-verdant-200 transition-colors"
          >
            <span className="font-primary font-medium text-shark-700 text-md">
              {selectedEvent || 'Go to Workspace'}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-shark-700 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && events.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
              <div className="py-2 max-h-64 overflow-y-auto">
                {events
                  .map((event) => (
                    <button
                      key={event.eventId}
                      onClick={() => {
                        handleClick(String(event.eventId));
                        setSelectedEvent(event.eventName);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left text-shark-700 px-4 py-1 hover:bg-verdant-50 transition-colors"
                    >
                      <span className="font-secondary font-medium text-sm">
                        {event.eventName}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </>
  );
}
