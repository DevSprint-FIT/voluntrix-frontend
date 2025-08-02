"use client";

import { useEffect, useState } from "react";
import Table, { Column } from "@/components/UI/Table";
import { Event, getEventsByStatus } from "@/services/eventTableService";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";

export default function ActiveEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setError(null);
        console.log("Fetching active events...");
        const activeEvents = await getEventsByStatus("ACTIVE");
        console.log("Received", activeEvents.length, "active events", activeEvents);
        console.log("Event data structure:", JSON.stringify(activeEvents[0]));
        console.log("Debug events array:", activeEvents);
        setEvents(activeEvents);
      } catch (error) {
        console.error("Failed to load active events", error);
        if (error instanceof Error) {
          setError(`Failed to load active events: ${error.message}`);
        } else {
          setError("Failed to load active events: An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const columns: Column<Event>[] = [
    {
      header: "Event Name",
      accessor: "eventTitle",
      cell: (value, row) => (
        <div className="flex flex-col">
          <span className="font-bold">{typeof value === "string" || typeof value === "number" ? value : "—"}</span>

          <span className="text-xs text-shark-500">#{row.eventId}</span>
        </div>
      ),
    },
    {
      header: "Date",
      accessor: "eventStartDate",
      cell: (value) => {
        if (value && (typeof value === "string" || typeof value === "number" || value instanceof Date)) {
          return <span>{formatDate(value)}</span>;
        }
        return <span>—</span>;
      },
    },
    { header: "Location", accessor: "eventLocation" },
    {
      header: "Status",
      accessor: "eventStatus",
      cell: () => (
        <span className="rounded-full bg-verdant-100 px-3 py-1 text-xs text-verdant-600">
          Active
        </span>
      ),
    },
    { header: "No of Volunteers", accessor: "volunteerCount" },
  ];

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Active Events</h1>
        <div className="text-center text-red-500 py-8">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 text-verdant-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading active events...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No active events found for this organization.
        </div>
      ) : (
        <Table columns={columns} data={events} />
      )}
    </div>
  );
}
