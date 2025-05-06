"use client";

import { useEffect, useState } from "react";
import Table, { Column } from "@/components/UI/Table";
import {
  AppliedEvent,
  getVolunteerAppliedEvents,
} from "@/services/volunteerEventService";
import { Loader2 } from "lucide-react";
import { Button } from "@heroui/button";

export default function AppliedEventsPage() {
  const [events, setEvents] = useState<AppliedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const volunteerId = 1; // Replace with actual volunteer ID

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getVolunteerAppliedEvents(volunteerId);
        setEvents(data);
      } catch (error) {
        console.error("Failed to load applied events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const columns: Column<AppliedEvent>[] = [
    {
      header: "Event Name",
      accessor: "eventName",
    },
    {
      header: "Event Type",
      accessor: "eventType",
    },
    {
      header: "Preferred Area",
      accessor: "contributionArea",
    },
    {
      header: "Actions",
      accessor: "eventName", // Using eventName as accessor, but override with custom cell
      cell: () => (
        <div className="flex items-center">
          <Button className="rounded-full bg-shark-950 text-shark-50 font-primary">
            Cancel
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Applied Events</h1>
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
