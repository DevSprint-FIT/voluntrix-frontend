"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Table, { Column } from "@/components/UI/Table";
import { Event, getEventsByOrgId } from "@/services/eventTableService";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";

export default function ActiveEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const orgIdString = searchParams?.get('orgId');
  const orgId = orgIdString && !isNaN(Number(orgIdString)) ? Number(orgIdString) : null;


  useEffect(() => {
    // Validate orgId
    if (orgId === null ) {
      setError("Invalid organization ID");
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        setError(null);
        console.log(`Fetching active events for orgId: ${orgId}`);
        const data = await getEventsByOrgId(orgId, "ACTIVE");
        console.log(`Received ${data?.length || 0} active events for orgId: ${orgId}`, data);
        setEvents(data);
      } catch (error) {
        console.error(`Failed to load active events for orgId: ${orgId}`, error);
        setError(`Failed to load active events for organization ${orgId}`);
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
      accessor: "eventStartDate",
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
          Active
        </span>
      ),
    },
    { header: "No of Volunteers", accessor: "volunteerCount" }
  ];

  // Show error state
  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Active Events</h1>
        <div className="text-center text-red-500 py-8">
          <p>{error}</p>
          <p className="text-sm mt-2 text-gray-600">
            Organization ID: {orgId}
          </p>
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
        <div className="flex justify-center items-center">
          <Loader2 className="h-8 w-8 text-verdant-600 animate-spin" />
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