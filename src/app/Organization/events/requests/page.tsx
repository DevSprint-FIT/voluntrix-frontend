

"use client";

import { Check, X, User } from "lucide-react";
import { useEffect, useState } from "react";
import Table, { Column } from "@/components/UI/Table";
import { Event, Volunteer, getEventsByStatus, updateEventStatus, getAllVolunteers } from "@/services/eventTableService";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import ConfirmationModal from "@/components/UI/ConfirmationModal";

export default function EventRequestsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [volunteers, setVolunteers] = useState<Map<number, Volunteer>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingEventId, setUpdatingEventId] = useState<number | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    eventId: number;
    status: "ACTIVE" | "DENIED";
    title: string;
    message: string;
    buttonText: string;
    buttonClass: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        console.log(" Starting to fetch event requests and volunteers...");
        
        // Fetch events and volunteers concurrently
        const [eventsData, volunteersData] = await Promise.all([
          getEventsByStatus("PENDING"),
          getAllVolunteers()
        ]);
        
        console.log("Fetched events:", eventsData);
        console.log(" Fetched volunteers map:", volunteersData);
        
        setEvents(eventsData);
        setVolunteers(volunteersData);
      } catch (error) {
        console.error(" Failed to load data", error);
  
  if (error instanceof Error) {
    setError(`Failed to load event requests: ${error.message}`);
  } else {
    setError("Failed to load event requests: An unknown error occurred.");
  }
}

        finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openConfirmationModal = (eventId: number, newStatus: "ACTIVE" | "DENIED") => {
    const isAccepting = newStatus === "ACTIVE";
    
    setConfirmAction({
      eventId,
      status: newStatus,
      title: isAccepting ? "Accept Event Request" : "Reject Event Request",
      message: isAccepting 
        ? "Are you sure you want to accept this event request? Once accepted, the event will be activated and managed under your organization."
        : "Are you sure you want to reject this event request? This action cannot be undone.",
      buttonText: isAccepting ? "Accept" : "Reject",
      buttonClass: isAccepting 
        ? "bg-verdant-500 hover:bg-verdant-600 text-white" 
        : "bg-red-500 hover:bg-red-600 text-white"
    });
    
    setConfirmModalOpen(true);
  };
  
  const handleConfirm = async () => {
    if (!confirmAction) return;
    
    const { eventId, status } = confirmAction;
    setConfirmModalOpen(false);
    setUpdatingEventId(eventId);
    
    try {
      console.log(`Updating event ${eventId} to status: ${status}`);
      
      const updatedEvent = await updateEventStatus(eventId, status);
      
      console.log('Update successful. Response:', updatedEvent);
      
      if (updatedEvent.eventStatus !== status) {
        console.warn(`Warning: Expected status ${status} but got ${updatedEvent.eventStatus}`);
      }
      
      // Remove the updated event from the list since it's no longer PENDING
      setEvents(prevEvents => {
        const newEvents = prevEvents.filter(event => event.eventId !== eventId);
        console.log(`Removed event ${eventId} from list. Remaining events:`, newEvents.length);
        return newEvents;
      });
    } catch (error) {
      console.error("Failed to update event status:", error);
      alert(`Failed to ${status === 'ACTIVE' ? 'accept' : 'reject'} event. Please try again.`);
    } finally {
      setUpdatingEventId(null);
      setConfirmAction(null);
    }
  };
  
  const handleCancel = () => {
    setConfirmModalOpen(false);
    setConfirmAction(null);
  };

  
  const VolunteerInfo = ({ eventHostId }: { eventHostId: number }) => {
    const volunteer = volunteers.get(eventHostId);
    
    console.log(` Looking for volunteer with ID: ${eventHostId}`, volunteer);
    
    if (!volunteer) {
      return (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-6 w-6 text-gray-500" />
          </div>
          <span className="text-gray-500">Unknown Host (ID: {eventHostId})</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {volunteer.profilePictureUrl && volunteer.profilePictureUrl !== "string" ? (
            <img 
              src={volunteer.profilePictureUrl} 
              alt={volunteer.fullName}
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
          <span className="text-sm font-medium">{volunteer.fullName}</span>
          <span className="text-xs text-gray-500">@{volunteer.username}</span>
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
            onClick={() => openConfirmationModal(row.eventId, "ACTIVE")}
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
            onClick={() => openConfirmationModal(row.eventId, "DENIED")}
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

  // Show error state
  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Event Requests</h1>
        <div className="text-center text-red-500 py-8">
          <p>{error}</p>
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
      <h1 className="text-2xl font-bold mb-4">Event Requests</h1>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 text-verdant-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading event requests...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No pending event requests found.
        </div>
      ) : (
        <Table columns={columns} data={events} />
      )}
      
      {/* Confirmation Modal */}
      {confirmAction && (
        <ConfirmationModal
          isOpen={confirmModalOpen}
          title={confirmAction.title}
          message={confirmAction.message}
          confirmButtonText={confirmAction.buttonText}
          confirmButtonClass={confirmAction.buttonClass}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}