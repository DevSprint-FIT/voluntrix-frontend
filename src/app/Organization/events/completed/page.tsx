"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Table, { Column } from "@/components/UI/Table";
import { Event, getEventsByOrgId } from "@/services/eventTableService";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";

export default function CompletedEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const orgIdString = searchParams?.get('orgId');
  const orgId = orgIdString && !isNaN(Number(orgIdString)) ? Number(orgIdString) : null;


  useEffect(() => {
    // Validate orgId
    if (orgId === null) {
      setError("Invalid organization ID");
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        setError(null);
        const data = await getEventsByOrgId(orgId, "COMPLETE");
        setEvents(data);
      } catch (error) {
        console.error("Failed to load completed events", error);
        setError("Failed to load completed events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [orgId]);

  const columns: Column<Event>[] = [
    { 
      header: "Event Name", 
      accessor: "eventTitle",
      cell: (value, row) => (
        <div className="flex flex-col">
          <span className="font-bold">{value}</span>
          <span className="text-xs text-shark-500">#{row.eventId}</span>
        </div>
      )
    },
    { 
      header: "Date", 
      accessor: "eventEndDate",
      cell: (value) => (
        <span>{formatDate(value)}</span>
      )
    },
    { header: "Location", accessor: "eventLocation" },
    { 
      header: "Status", 
      accessor: "eventStatus",
      cell: () => (
        <span className="rounded-full bg-verdant-100 px-3 py-1 text-xs text-verdant-600">
          COMPLETE
        </span>
      ),
    },
    { header: "No of Volunteers", accessor: "volunteerCount" }
  ];

  // Show error state
  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Completed Events</h1>
        <div className="text-center text-red-500 py-8">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Completed Events</h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="h-8 w-8 text-verdant-600 animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No completed events found for this organization.
        </div>
      ) : (
        <Table columns={columns} data={events} />
      )}
    </div>
  );
}