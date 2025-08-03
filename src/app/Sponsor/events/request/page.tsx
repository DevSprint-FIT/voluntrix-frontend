"use client";

import { User } from "lucide-react";
import { useEffect, useState } from "react";
import Table, { Column } from "@/components/UI/Table";
import { Loader2 } from "lucide-react";
import { sponsorService, SponsorEventData } from "@/services/sponsorService";

interface Volunteer {
  volunteerId: number;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
}

export default function SponsorEventRequestsPage() {
  const [events, setEvents] = useState<SponsorEventData[]>([]);
  const [volunteers, setVolunteers] = useState<Map<number, Volunteer>>(new Map());
  const [loading, setLoading] = useState(true);

  
  const SPONSOR_ID = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get ALL sponsor event data (not just pending ones)
        const allEventData = await sponsorService.getAllSponsorEventData(SPONSOR_ID);
        console.log('All event data:', allEventData);
        
        // Show ALL sponsorship requests (PENDING, APPROVED, REJECTED)
        // This shows the sponsor's request history
        setEvents(allEventData);

        // Fetch volunteer details for each event host in parallel
        const volunteerMap = new Map<number, Volunteer>();
        
        // Get all unique host IDs
        const hostIds = new Set<number>();
        for (const event of allEventData) {
          try {
            const eventDetails = await sponsorService.getEvent(event.eventId);
            hostIds.add(eventDetails.eventHostId);
          } catch (error) {
            console.error(`Error fetching event details for ${event.eventId}:`, error);
          }
        }

        // Fetch volunteers for all unique host IDs
        const volunteerPromises = Array.from(hostIds).map(async (hostId) => {
          try {
            const volunteer = await sponsorService.getVolunteer(hostId);
            volunteerMap.set(hostId, volunteer);
          } catch (error) {
            console.error(`Error fetching volunteer for host ${hostId}:`, error);
          }
        });

        await Promise.all(volunteerPromises);
        setVolunteers(volunteerMap);
        
      } catch (error) {
        console.error("Error fetching event requests:", error);
        alert("Failed to load event requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600">
            Approved
          </span>
        );
      case 'REJECTED':
      case 'DENIED':
        return (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-600">
            Rejected
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="rounded-full bg-[#FDF5EC] px-3 py-1 text-xs text-[#BD6F01]">
            Pending
          </span>
        );
    }
  };

  const VolunteerInfo = ({ eventId }: { eventId: number }) => {
    const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const fetchVolunteerInfo = async () => {
        try {
          // Get event details to find host ID
          const eventDetails = await sponsorService.getEvent(eventId);
          
          // Check if we already have this volunteer in our map
          const cachedVolunteer = volunteers.get(eventDetails.eventHostId);
          if (cachedVolunteer) {
            setVolunteer(cachedVolunteer);
          } else {
            // Fetch volunteer details
            const volunteerData = await sponsorService.getVolunteer(eventDetails.eventHostId);
            setVolunteer(volunteerData);
          }
        } catch (error) {
          console.error(`Error fetching volunteer info for event ${eventId}:`, error);
          setVolunteer(null);
        } finally {
          setLoading(false);
        }
      };
      
      fetchVolunteerInfo();
    }, [eventId]);

    if (loading) {
      return (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
          </div>
          <span className="text-gray-500">Loading...</span>
        </div>
      );
    }

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
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={volunteer.profilePictureUrl} 
              alt={`${volunteer.firstName} ${volunteer.lastName}`}
              width={48}
              height={48}
              className="object-cover"
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
      header: "Event Host",
      accessor: "eventId",
      cell: (_, row) => <VolunteerInfo eventId={row.eventId} />
    },
    { 
      header: "Event Date", 
      accessor: "eventStartDate",
      cell: (value) => {
        const dateValue = value as string;
        return <span>{dateValue ? formatDate(dateValue) : 'N/A'}</span>;
      }
    },
    { 
      header: "Location", 
      accessor: "eventLocation",
      cell: (value) => (
        <span className="text-sm text-gray-600">{value || 'N/A'}</span>
      )
    },
    { 
      header: "Sponsorship Details", 
      accessor: "sponsorshipType",
      cell: (value, row) => (
        <div className="flex flex-col">
          <span className="font-medium">{value}</span>
          <span className="text-sm font-semibold text-verdant-600">
            ${row.sponsorshipAmount?.toLocaleString() || 'N/A'}
          </span>
        </div>
      )
    },
    { 
      header: "Request Status", 
      accessor: "requestStatus",
      cell: (value) => getStatusBadge(value as string)
    },
    { 
      header: "Event Status", 
      accessor: "eventStatus",
      cell: (value) => (
        <span className="text-sm text-gray-600 capitalize">
          {(value as string).toLowerCase()}
        </span>
      )
    }
  ];

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Sponsorship Requests</h1>
        
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 text-verdant-600 animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sponsorship requests found</h3>
          <p className="text-gray-500">You haven&apos;t made any sponsorship requests yet.</p>
        </div>
      ) : (
        <Table columns={columns} data={events} />
      )}
    </div>
  );
}