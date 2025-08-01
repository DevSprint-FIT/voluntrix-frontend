"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { EventType } from "@/types/EventType";
import authService from "@/services/authService";

interface EventHeaderProps {
  eventId: string;
}

const EventHeader: React.FC<EventHeaderProps> = ({ eventId }) => {
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEvent = async () => {
      try {
        setLoading(true);

        // Get token from AuthService
        const token = authService.getToken();

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get<EventType>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/with-org/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEvent(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      getEvent();
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="bg-white px-6 py-4 pt-10 sticky top-0 z-20">
        <div className="relative inline-block">
          <div className="flex items-center space-x-2 bg-verdant-50 px-4 py-2 rounded-lg border border-verdant-200">
            <div className="animate-pulse">
              <div className="h-5 bg-verdant-200 rounded w-48"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white px-6 py-4 pt-10 sticky top-0 z-20">
        <div className="relative inline-block">
          <div className="flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
            <span className="font-secondary font-semibold text-red-600">
              {error}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white px-6 py-4 pt-10 sticky top-0 z-20">
      <div className="relative inline-block">
        <div className="flex items-center space-x-2 bg-verdant-50 px-4 py-2 rounded-lg border border-verdant-200">
          <span className="font-secondary font-semibold text-shark-950">
            {event?.eventTitle || "Event"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
