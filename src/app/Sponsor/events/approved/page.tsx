"use client";

import { useEffect, useState } from "react";
import Table, { Column } from "@/components/UI/Table";
import { Loader2 } from "lucide-react";
import { sponsorService, SponsorEventData } from "@/services/sponsorService";

export default function SponsorActiveEventsPage() {
  const [events, setEvents] = useState<SponsorEventData[]>([]);
  const [loading, setLoading] = useState(true);

  const SPONSOR_ID = 1;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        // Get all sponsor event data
        const allEventData = await sponsorService.getAllSponsorEventData();
        console.log("All event data received:", allEventData);

        // Filter for active events only (eventStatus = 'ACTIVE')
        const activeEvents = sponsorService.getActiveEvents(allEventData);

        console.log("Active events after filtering:", activeEvents);

        setEvents(activeEvents);
      } catch (error) {
        console.error("Error fetching active events:", error);

        alert("Failed to load active events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns: Column<SponsorEventData>[] = [
    {
      header: "Event Name",
      accessor: "eventTitle",
      cell: (value, row) => (
        <div className="flex flex-col">
          <span className="font-bold">{value}</span>
          <span className="text-xs text-shark-500">#{row.eventId}</span>
        </div>
      ),
    },
    {
      header: "Date",
      accessor: "eventStartDate",
      cell: (value) => {
        const dateValue = value as string;
        return <span>{dateValue ? formatDate(dateValue) : "N/A"}</span>;
      },
    },
    {
      header: "Location",
      accessor: "eventLocation",
    },
    {
      header: "Status",
      accessor: "eventStatus",
      cell: () => (
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 flex items-center gap-1">
          ACTIVE
        </span>
      ),
    },
    {
      header: "Sponsorship",
      accessor: "sponsorshipType",
      cell: (value, row) => (
        <div className="flex flex-col">
          <span className="font-medium">{value}</span>
          <span className="text-xs text-gray-500">
            LKR {row.sponsorshipAmount.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      header: "Action",
      accessor: "eventId",
      cell: (_, row) => {
        // Only show pay button if event is upcoming and approved
        const isUpcoming = sponsorService.isEventUpcoming(row.eventStartDate);
        const canPay = isUpcoming && row.requestStatus === "APPROVED";

        if (!canPay) {
          return (
            <span className="text-sm text-gray-500">
              {row.requestStatus === "APPROVED"
                ? "Event Started"
                : "Pending Approval"}
            </span>
          );
        }

        return (
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors bg-verdant-600 text-white hover:bg-verdant-700">
            Pay Now
          </button>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Active Events</h1>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 text-verdant-600 animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No active events found.
        </div>
      ) : (
        <Table columns={columns} data={events} />
      )}
    </div>
  );
}
