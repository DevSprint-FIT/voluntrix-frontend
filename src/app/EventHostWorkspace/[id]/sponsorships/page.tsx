'use client';

import React, { useState, useEffect } from 'react';
import { HandCoins, MessageCircle, Check, X } from 'lucide-react';
import Table, { Column } from '@/components/UI/Table';
import ChatController from '@/app/chat/ChatController';

// Types for sponsorship data
interface SponsorshipRequest {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  sponsorshipType: string;
}

interface EventSponsorship {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  sponsorshipType: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
}

const SponsorshipsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sponsorshipRequests, setSponsorshipRequests] = useState<
    SponsorshipRequest[]
  >([]);
  const [eventSponsorships, setEventSponsorships] = useState<
    EventSponsorship[]
  >([]);

  useEffect(() => {
    // Simulate data loading with dummy data
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Dummy data for Sponsorship Requests
        const dummyRequests: SponsorshipRequest[] = [
          {
            id: '1',
            name: 'John Smith',
            jobTitle: 'Marketing Director',
            company: 'TechCorp Solutions',
            sponsorshipType: 'Gold',
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            jobTitle: 'CEO',
            company: 'Green Energy Ltd',
            sponsorshipType: 'Platinum',
          },
        ];

        // Dummy data for Event Sponsorships
        const dummySponsorships: EventSponsorship[] = [
          {
            id: '1',
            name: 'Michael Brown',
            jobTitle: 'VP of Operations',
            company: 'Global Industries',
            sponsorshipType: 'Platinum',
          },
          {
            id: '2',
            name: 'Emily Davis',
            jobTitle: 'Regional Manager',
            company: 'Local Business Hub',
            sponsorshipType: 'Silver',
          },
        ];

        setSponsorshipRequests(dummyRequests);
        setEventSponsorships(dummySponsorships);
      } catch (error) {
        console.error('Error fetching sponsorship data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get sponsorship type badge color
  const getSponsorshipBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'platinum':
        return 'bg-gray-100 text-gray-800 border border-gray-300';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'silver':
        return 'bg-gray-50 text-gray-700 border border-gray-200';
      case 'bronze':
        return 'bg-orange-100 text-orange-800 border border-orange-300';
      default:
        return 'bg-blue-100 text-blue-800 border border-blue-300';
    }
  };

  // Action handlers
  const handleApprove = (id: string) => {
    console.log('Approved sponsorship request:', id);
    // TODO: Implement approval logic
  };

  const handleReject = (id: string) => {
    console.log('Rejected sponsorship request:', id);
    // TODO: Implement rejection logic
  };

  const handleChat = (id: string, type: 'request' | 'sponsorship') => {
    console.log(`Opening chat for ${type}:`, id);
    // TODO: Implement chat functionality
  };

  const handleOpenSponsorChat = () => {
    console.log('Opening sponsor chat');
    // TODO: Implement sponsor chat functionality - to be integrated later
  };

  // Table configurations
  const sponsorshipRequestColumns: Column<SponsorshipRequest>[] = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Job Title',
      accessor: 'jobTitle',
    },
    {
      header: 'Company',
      accessor: 'company',
    },
    {
      header: 'Sponsorship Type',
      accessor: 'sponsorshipType',
      cell: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getSponsorshipBadgeColor(
            value as string
          )}`}
        >
          {value}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value, row) => (
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleApprove(value as string)}
            className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
            title="Approve"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => handleReject(value as string)}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            title="Reject"
          >
            <X size={16} />
          </button>
        </div>
      ),
    },
  ];

  const eventSponsorshipColumns: Column<EventSponsorship>[] = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Job Title',
      accessor: 'jobTitle',
    },
    {
      header: 'Company',
      accessor: 'company',
    },
    {
      header: 'Sponsorship Type',
      accessor: 'sponsorshipType',
      cell: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getSponsorshipBadgeColor(
            value as string
          )}`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
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
            <div className="hidden md:block absolute right-0 top-0 h-full">
              <ChatController />
            </div>
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
            <Table
              columns={sponsorshipRequestColumns}
              data={sponsorshipRequests}
            />
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
            <Table columns={eventSponsorshipColumns} data={eventSponsorships} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SponsorshipsPage;
