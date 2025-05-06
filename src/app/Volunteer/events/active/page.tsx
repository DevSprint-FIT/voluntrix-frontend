"use client";

import { useEffect, useState } from "react";
import Table, { Column } from "@/components/UI/Table";
import {
  ActiveEvent,
  getVolunteerActiveEvents,
} from "@/services/volunteerEventService";
import { Loader2 } from "lucide-react";

export default function ActiveEventsPage() {
  const [events, setEvents] = useState<ActiveEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const volunteerId = 1; // Replace with actual volunteer ID

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getVolunteerActiveEvents(volunteerId);
        setEvents(data);
      } catch (error) {
        console.error("Failed to load active events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Active Events</h1>
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
