"use client";

import { useEffect, useState } from "react";
import Table, { Column } from "@/components/UI/Table";
import {
  ActiveEvent,
  getVolunteerActiveEvents,
} from "@/services/volunteerEventService";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";

export default function ActiveEventsPage() {
  const [events, setEvents] = useState<ActiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRowClick = (row: ActiveEvent) => {
    router.push(`/VolunteerWorkspace/${String(row.eventId)}/tasks`);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Check authentication
        if (!authService.isAuthenticated()) {
          router.replace("/auth/login");
          return;
        }

        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          router.replace("/auth/login");
          return;
        }

        // Check if profile is completed
        if (!currentUser.profileCompleted) {
          router.replace("/auth/profile-form?type=volunteer");
          return;
        }

        setLoading(true);
        setError(null);

        const data = await getVolunteerActiveEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to load active events", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load active events"
        );

        // If authentication fails, redirect to login
        if (error instanceof Error && error.message.includes("401")) {
          router.replace("/auth/login");
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  const columns: Column<ActiveEvent>[] = [
    {
      header: "Event Name",
      accessor: "eventName",
    },
    {
      header: "Start Date",
      accessor: "startDate",
      cell: (value) => {
        // Convert array [year, month, day] to readable date
        const dateArray = value as unknown as number[];
        if (Array.isArray(dateArray) && dateArray.length === 3) {
          return `${dateArray[0]}-${String(dateArray[1]).padStart(
            2,
            "0"
          )}-${String(dateArray[2]).padStart(2, "0")}`;
        }
        return String(value);
      },
    },
    {
      header: "End Date",
      accessor: "endDate",
      cell: (value) => {
        // Convert array [year, month, day] to readable date
        const dateArray = value as unknown as number[];
        if (Array.isArray(dateArray) && dateArray.length === 3) {
          return `${dateArray[0]}-${String(dateArray[1]).padStart(
            2,
            "0"
          )}-${String(dateArray[2]).padStart(2, "0")}`;
        }
        return String(value);
      },
    },
    {
      header: "Location",
      accessor: "location",
    },
  ];

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Active Events</h1>
        <div className="flex justify-center items-center">
          <Loader2 className="h-8 w-8 text-verdant-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Active Events</h1>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Active Events</h1>
      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No active events found.
        </div>
      ) : (
        <Table
          columns={columns}
          data={events}
          handleRowClick={handleRowClick}
        />
      )}
    </div>
  );
}
