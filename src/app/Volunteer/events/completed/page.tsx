"use client";

import { useEffect, useState } from "react";
import Table, { Column } from "@/components/UI/Table";
import {
  CompletedEvent,
  getVolunteerCompletedEvents,
} from "@/services/volunteerEventService";
import { Loader2 } from "lucide-react";

export default function CompletedEventsPage() {
  const [events, setEvents] = useState<CompletedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const volunteerId = 1; // Replace with actual volunteer ID

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getVolunteerCompletedEvents(volunteerId);
        setEvents(data);
      } catch (error) {
        console.error("Failed to load completed events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const columns: Column<CompletedEvent>[] = [
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
      header: "Event Type",
      accessor: "eventType",
    },
    {
      header: "Contributed Area",
      accessor: "contributionArea",
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
