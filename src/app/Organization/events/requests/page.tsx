"use client";

import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import Table, { Column } from "@/components/UI/Table";
import { Event, getEventsByOrgId } from "@/services/eventTableService";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";

export default function EventRequestsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const orgId = 1; // Change the id

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEventsByOrgId(orgId, "PENDING");
        setEvents(data);
      } catch (error) {
        console.error("Failed to load event requests", error);
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
    { header: "Date", accessor: "eventStartDate",
      cell: (value) => (
        <span>{formatDate(value)}</span>
      )
     },
    { header: "Location", accessor: "eventLocation" },
    { header: "Status", accessor: "eventStatus",
      cell: () => (
        <span className=" rounded-full bg-[#FDF5EC] px-3 py-1 text-xs  text-[#BD6F01]">
          Pending
        </span>
      ),
     },
    {
      header: "Actions",
      accessor: "eventStatus", 
      cell: (_, row) => (
        <div className="flex items-center space-x-2">
        {/* Green Accept Button */}
        <div className="rounded-md bg-verdant-100 p-2 cursor-pointer hover:bg-verdant-200">
          <Check className="h-4 w-4 text-verdant-600" />
        </div>

        {/* Red Reject Button */}
        <div className="rounded-md bg-red-100 p-2 cursor-pointer hover:bg-red-200">
          <X className="h-4 w-4 text-red-700" />
        </div>
      </div>
      ),
    },
  ];


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Event Requests</h1>
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
