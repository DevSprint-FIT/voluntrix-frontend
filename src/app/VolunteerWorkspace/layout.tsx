"use client";

import VolunteerWorkspaceSidebar from "@/components/UI/VolunteerWorkspaceSidebar";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Event {
  id: string;
  name: string;
}

export default function VolunteerWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedEvent, setSelectedEvent] = useState<Event>({
    id: "1",
    name: "Community Clean-up Drive",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Dummy data for events
  const events: Event[] = [
    { id: "1", name: "Community Clean-up Drive" },
    { id: "2", name: "Food Distribution Program" },
    { id: "3", name: "Tree Planting Initiative" },
    { id: "4", name: "Elder Care Support" },
    { id: "5", name: "Educational Workshop" },
  ];

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex">
      <VolunteerWorkspaceSidebar />
      <div className="flex-1 ml-60">
        {/* Event Dropdown Header */}
        <div className="bg-white px-6 py-4 pt-10 sticky top-0 z-20">
          <div className="relative inline-block">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 bg-verdant-50 hover:bg-verdant-100 px-4 py-2 rounded-lg border border-verdant-200 transition-colors"
            >
              <span className="font-secondary font-semibold text-shark-950">
                {selectedEvent.name}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-shark-700 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                <div className="py-2 max-h-64 overflow-y-auto">
                  {events.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => handleEventSelect(event)}
                      className={`w-full text-left px-4 py-3 hover:bg-verdant-50 transition-colors ${
                        selectedEvent.id === event.id
                          ? "bg-verdant-50 text-verdant-700"
                          : "text-shark-950"
                      }`}
                    >
                      <span className="font-secondary font-medium">
                        {event.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">{children}</div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}
