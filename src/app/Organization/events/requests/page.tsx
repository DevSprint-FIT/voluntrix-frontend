"use client";

import { Check, X, User } from "lucide-react";
import { useEffect, useState } from "react";
import Table, { Column } from "@/components/UI/Table";
import { Event, Volunteer, getEventsByOrgId, updateEventStatus, getAllVolunteers } from "@/services/eventTableService";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";

export default function EventRequestsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [volunteers, setVolunteers] = useState<Map<number, Volunteer>>(new Map());
  const [loading, setLoading] = useState(true);
  const [updatingEventId, setUpdatingEventId] = useState<number | null>(null);

  const orgId = 1; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events and volunteers concurrently
        const [eventsData, volunteersData] = await Promise.all([
          getEventsByOrgId(orgId, "PENDING"),
          getAllVolunteers()
        ]);
        
        setEvents(eventsData);
        setVolunteers(volunteersData);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusUpdate = async (eventId: number, newStatus: "ACTIVE" | "DENIED") => {
    setUpdatingEventId(eventId);
    try {
      console.log(`Updating event ${eventId} to status: ${newStatus}`);
      
      const updatedEvent = await updateEventStatus(eventId, newStatus);
      console.log('Update successful:', updatedEvent);
      
      // Remove the updated event from the list since it's no longer PENDING
      setEvents(prevEvents => {
        const newEvents = prevEvents.filter(event => event.eventId !== eventId);
        console.log(`Removed event ${eventId} from list. Remaining events:`, newEvents.length);
        return newEvents;
      });
      

    } catch (error) {
      console.error("Failed to update event status:", error);
      alert(`Failed to ${newStatus === 'ACTIVE' ? 'accept' : 'reject'} event. Please try again.`);
    } finally {
      setUpdatingEventId(null);
    }
  };

  const VolunteerInfo = ({ eventHostId }: { eventHostId: number }) => {
    const volunteer = volunteers.get(eventHostId);
    
    if (!volunteer) {
      return (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-6 w-6 text-gray-500" />
          </div>
          <span className="text-gray-500">Unknown Host</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {volunteer.profilePictureUrl ? (
            <img 
              src={volunteer.profilePictureUrl} 
              alt={`${volunteer.firstName} ${volunteer.lastName}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            <User className="h-6 w-6 text-gray-500" />
          )}
          {volunteer.profilePictureUrl && (
            <User className="h-6 w-6 text-gray-500 hidden" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{volunteer.firstName} {volunteer.lastName}</span>
         
        </div>
      </div>
    );
  };

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
      header: "Requested By",
      accessor: "eventHostId",
      cell: (_, row) => <VolunteerInfo eventHostId={row.eventHostId} />
    },
    { 
      header: "Date", 
      accessor: "eventStartDate",
      cell: (value) => (
        <span>{formatDate(value)}</span>
      )
    },
    
    { 
      header: "Status", 
      accessor: "eventStatus",
      cell: () => (
        <span className="rounded-full bg-[#FDF5EC] px-3 py-1 text-xs text-[#BD6F01]">
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
          <button
            className={`rounded-md bg-verdant-100 p-2 cursor-pointer hover:bg-verdant-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              updatingEventId === row.eventId ? 'opacity-50' : ''
            }`}
            onClick={() => handleStatusUpdate(row.eventId, "ACTIVE")}
            disabled={updatingEventId === row.eventId}
            title="Accept Event"
          >
            {updatingEventId === row.eventId ? (
              <Loader2 className="h-4 w-4 text-verdant-600 animate-spin" />
            ) : (
              <Check className="h-4 w-4 text-verdant-600" />
            )}
          </button>

          {/* Red Reject Button */}
          <button
            className={`rounded-md bg-red-100 p-2 cursor-pointer hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              updatingEventId === row.eventId ? 'opacity-50' : ''
            }`}
            onClick={() => handleStatusUpdate(row.eventId, "DENIED")}
            disabled={updatingEventId === row.eventId}
            title="Reject Event"
          >
            {updatingEventId === row.eventId ? (
              <Loader2 className="h-4 w-4 text-red-700 animate-spin" />
            ) : (
              <X className="h-4 w-4 text-red-700" />
            )}
          </button>
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
      ) : events.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No pending event requests found.
        </div>
      ) : (
        <Table columns={columns} data={events} />
      )}
    </div>
  );
}