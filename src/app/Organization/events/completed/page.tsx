
"use client";

import { useEffect, useState } from "react";
import Table, { Column } from "@/components/UI/Table";
import { Event, getEventsByOrgId } from "@/services/eventTableService";
import { Loader2 } from "lucide-react";


export default function CompletedEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const orgId = 1; // Replace with organizationId

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEventsByOrgId(orgId, "COMPLETE");
        setEvents(data);
      } catch (error) {
        console.error("Failed to load completed events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const columns: Column<Event>[] = [
    { header: "Event Name", accessor: "eventTitle",
      cell: (value, row) => (
        <div className="flex flex-col">
          <span className="font-bold">{value}</span>
          <span className="text-xs text-shark-500">#{row.eventId}</span> {/* show ID under title */}
        </div>
      )
     },
    { header: "Date", accessor: "eventDate" },
    { header: "Location", accessor: "eventLocation" },
    { header: "Status", accessor: "eventStatus",
      cell: () => (
        <span className=" rounded-full bg-verdant-100 px-3 py-1 text-xs  text-verdant-600">
          COMPLETE
        </span>
      ),
     },
  ];

  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Completed Events</h1>
      {loading ? (
      <div className="flex justify-center items-center">
      <Loader2 className="h-8 w-8 text-verdant-600 animate-spin" />
      </div>
      ) : (
     <Table columns={columns} data={events} />
      )}
   </div>
  );
}
