'use client';

import React, { useState, useEffect } from 'react';
import { HandCoins, MessageCircle, Check, X } from 'lucide-react';
import Table, { Column } from '@/components/UI/Table';
import { SponsorshipRequestType } from '@/types/SponsorshipRequestType';
import {
  fetchSponReqWithNameByEvent,
  updateSponsorshipRequestStatus,
} from '@/services/sponsorshipRequestService';
import { updateSponsorshipAvailability } from '@/services/sponsorshipService';

const SponsorshipsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<
    SponsorshipRequestType[]
  >([]);
  const [approvedSponsors, setApprovedSponsors] = useState<
    SponsorshipRequestType[]
  >([]);

  const resolvedParams = React.use(params);
  const eventId = Number(resolvedParams.id);

  useEffect(() => {
    // Simulate data loading with dummy data
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const data = await fetchSponReqWithNameByEvent(eventId);
        console.log('Fetched sponsorship data:', data);

        const pending = data.filter((item) => item.status === 'PENDING');
        const approved = data.filter((item) => item.status === 'APPROVED');

        setPendingRequests(pending);
        setApprovedSponsors(approved);
      } catch (error) {
        console.error('Error fetching sponsorship data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  // Action handlers
  const handleApprove = async (id: number) => {
    try {
      console.log('Approving sponsorship request:', id);
      const approvedItem = pendingRequests.find((req) => req.requestId === id);
      if (!approvedItem) return;

      await updateSponsorshipRequestStatus(id, 'APPROVED');
      await updateSponsorshipAvailability(id, false);

      setPendingRequests((prev) => prev.filter((req) => req.requestId !== id));
      setApprovedSponsors((prev) => [
        ...prev,
        { ...approvedItem, status: 'APPROVED' },
      ]);
    } catch (error) {
      console.error('Error approving sponsorship request:', error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      console.log('Rejecting sponsorship request:', id);

      setPendingRequests((prev) => prev.filter((req) => req.requestId !== id));

      await updateSponsorshipRequestStatus(id, 'REJECTED');
    } catch (error) {
      console.error('Error rejecting sponsorship request:', error);
    }
  };

  // const handleChat = (id: string, type: 'request' | 'sponsorship') => {
  //   console.log(`Opening chat for ${type}:`, id);
  //   // TODO: Implement chat functionality
  // };

  const handleOpenSponsorChat = () => {
    console.log('Opening sponsor chat');
    // TODO: Implement sponsor chat functionality - to be integrated later
  };

  // Table configurations
  const sponsorshipRequestColumns: Column<SponsorshipRequestType>[] = [
    {
      header: 'Company',
      accessor: 'company',
    },
    {
      header: 'Job Title',
      accessor: 'jobTitle',
    },
    {
      header: 'Sponsorship Type',
      accessor: 'sponsorshipName',
      cell: (value) => (
        <span className="px-3 py-1 rounded-full text-xs font-medium">
          {value}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'requestId',
      cell: (value, row) => (
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleApprove(row.requestId)}
            className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
            title="Approve"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => handleReject(row.requestId)}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            title="Reject"
          >
            <X size={16} />
          </button>
        </div>
      ),
    },
  ];

  const eventSponsorshipColumns: Column<SponsorshipRequestType>[] = [
    {
      header: 'Company',
      accessor: 'company',
    },
    {
      header: 'Job Title',
      accessor: 'jobTitle',
    },
    {
      header: 'Sponsorship Type',
      accessor: 'sponsorshipName',
      cell: (value) => (
        <span className="px-3 py-1 rounded-full text-xs font-medium">
          {value}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verdant-600 mx-auto mb-4"></div>
          <p className="text-shark-600 font-secondary">
            Loading sponsorships...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <div className="bg-white mb-6 mt-2">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HandCoins className="h-8 w-8 text-verdant-600" />
              <div>
                <h1 className="text-3xl font-bold text-shark-950 font-secondary">
                  Sponsorships
                </h1>
                <p className="text-shark-600 mt-2 font-secondary">
                  Manage sponsorship requests and current event sponsors
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenSponsorChat}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-verdant-600 text-white hover:bg-verdant-700 transition-colors font-medium"
              title="Chat with Sponsors"
            >
              <MessageCircle size={20} />
              Chat with Sponsors
            </button>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="px-6 space-y-20 mt-10">
        {/* Sponsorship Requests Table */}
        <div>
          <h2 className="text-2xl font-bold text-shark-950 font-secondary mb-1">
            Sponsorship Requests
          </h2>
          <p className="text-shark-600 mb-4 font-secondary">
            Review and manage incoming sponsorship requests
          </p>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-shark-600">
                Loading sponsorship requests...
              </div>
            </div>
          ) : (
            <Table columns={sponsorshipRequestColumns} data={pendingRequests} />
          )}
        </div>

        {/* Event Sponsorships Table */}
        <div>
          <h2 className="text-2xl font-bold text-shark-950 font-secondary mb-1">
            Event Sponsorships
          </h2>
          <p className="text-shark-600 mb-4 font-secondary">
            Current confirmed sponsors for this event
          </p>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-shark-600">
                Loading event sponsorships...
              </div>
            </div>
          ) : (
            <Table columns={eventSponsorshipColumns} data={approvedSponsors} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SponsorshipsPage;
