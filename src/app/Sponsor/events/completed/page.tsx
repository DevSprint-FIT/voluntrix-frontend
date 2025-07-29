"use client";

import { useEffect, useState } from "react";
import Table, { Column } from "@/components/UI/Table";
import { Loader2, DollarSign } from "lucide-react";
import { sponsorService, SponsorEventData } from "@/services/sponsorService";

export default function SponsorCompletedEventsPage() {
  const [events, setEvents] = useState<SponsorEventData[]>([]);
  const [loading, setLoading] = useState(true);
  
  
  const SPONSOR_ID = 1;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
       
        const allEventData = await sponsorService.getAllSponsorEventData(SPONSOR_ID);
        
        
        const completedEvents = sponsorService.getCompletedEvents(allEventData);
        
        setEvents(completedEvents);
      } catch (error) {
        console.error("Error fetching completed events:", error);
        alert("Failed to load completed events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
      )
    },
    { 
      header: "End Date", 
      accessor: "eventEndDate",
      cell: (value) => {
        const dateValue = value as string;
        return <span>{dateValue ? formatDate(dateValue) : 'N/A'}</span>;
      }
    },
    { 
      header: "Location", 
      accessor: "eventLocation" 
    },
    { 
      header: "Status", 
      accessor: "eventStatus",
      cell: () => (
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 flex items-center gap-1">
          Complete
        </span>
      ),
    },
    {
      header: "Sponsorship Type", 
      accessor: "sponsorshipType",
      cell: (value) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {value}
        </span>
      )
    },
    {
      header: "Total Contribution", 
      accessor: "sponsorshipAmount",
      cell: (value) => (
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4 text-verdant-600" />
          <span className="font-semibold text-verdant-600">
            {value ? `${value.toLocaleString()}` : 'N/A'}
          </span>
        </div>
      )
    },
    {
      header: "Volunteers", 
      accessor: "volunteerCount",
      cell: (value) => (
        <span className="text-sm text-gray-600">
          {value || 0} volunteers
        </span>
      )
    }
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Completed Events</h1>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 text-verdant-600 animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No completed events found.
        </div>
      ) : (
        <Table columns={columns} data={events} />
      )}
    </div>
  );
}