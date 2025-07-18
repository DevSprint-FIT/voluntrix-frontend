"use client";

import React, { useState, useEffect } from "react";
import { Users, Check, X } from "lucide-react";
import Table, { Column } from "@/components/UI/Table";

// Types for volunteer data
interface EventVolunteer {
  id: string;
  volunteer: string;
  contributionArea: string;
}

interface VolunteerApplication {
  id: string;
  volunteer: string;
  contributionArea: string;
  description: string;
}

const EventVolunteersPage = () => {
  const [activeTab, setActiveTab] = useState<"volunteers" | "applications">(
    "volunteers"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [eventVolunteers, setEventVolunteers] = useState<EventVolunteer[]>([]);
  const [volunteerApplications, setVolunteerApplications] = useState<
    VolunteerApplication[]
  >([]);

  useEffect(() => {
    // Simulate data loading with dummy data
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Dummy data for Event Volunteers
        const dummyVolunteers: EventVolunteer[] = [
          {
            id: "1",
            volunteer: "John Smith",
            contributionArea: "LOGISTICS",
          },
          {
            id: "2",
            volunteer: "Sarah Johnson",
            contributionArea: "EDITORIAL",
          },
          {
            id: "3",
            volunteer: "Michael Brown",
            contributionArea: "PROGRAMMING",
          },
        ];

        // Dummy data for Volunteer Applications
        const dummyApplications: VolunteerApplication[] = [
          {
            id: "1",
            volunteer: "Emily Davis",
            contributionArea: "DESIGN",
            description:
              "I have 3 years of experience in digital marketing and social media management. I would love to help promote this event.",
          },
          {
            id: "2",
            volunteer: "Alex Wilson",
            contributionArea: "DESIGN",
            description:
              "Professional photographer with experience in event coverage. I can capture high-quality photos throughout the event.",
          },
          {
            id: "3",
            volunteer: "Jessica Garcia",
            contributionArea: "LOGISTICS",
            description:
              "I have worked in hospitality for 5 years and can assist with food service and guest relations during the event.",
          },
        ];

        setEventVolunteers(dummyVolunteers);
        setVolunteerApplications(dummyApplications);
      } catch (error) {
        console.error("Error fetching volunteer data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Action handlers
  const handleApproveApplication = (id: string) => {
    console.log("Approved volunteer application:", id);
    // TODO: Implement approval logic
  };

  const handleRejectApplication = (id: string) => {
    console.log("Rejected volunteer application:", id);
    // TODO: Implement rejection logic
  };

  // Helper function to get category badge color using system colors
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "DESIGN":
        return "bg-verdant-100 text-verdant-800";
      case "EDITORIAL":
        return "bg-verdant-200 text-verdant-900";
      case "LOGISTICS":
        return "bg-shark-100 text-shark-800";
      case "PROGRAMMING":
        return "bg-shark-200 text-shark-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Table configurations
  const eventVolunteersColumns: Column<EventVolunteer>[] = [
    {
      header: "Volunteer",
      accessor: "volunteer",
    },
    {
      header: "Contribution Area",
      accessor: "contributionArea",
      cell: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(
            value as string
          )}`}
        >
          {value}
        </span>
      ),
    },
  ];

  const volunteerApplicationsColumns: Column<VolunteerApplication>[] = [
    {
      header: "Volunteer",
      accessor: "volunteer",
    },
    {
      header: "Contribution Area",
      accessor: "contributionArea",
      cell: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(
            value as string
          )}`}
        >
          {value}
        </span>
      ),
    },
    {
      header: "Description",
      accessor: "description",
      cell: (value) => (
        <div className="max-w-md">
          <p className="text-sm text-shark-700 line-clamp-2">
            {value as string}
          </p>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (value) => (
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleApproveApplication(value as string)}
            className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
            title="Approve Application"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => handleRejectApplication(value as string)}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            title="Reject Application"
          >
            <X size={16} />
          </button>
        </div>
      ),
    },
  ];

  const TabButton = ({
    tabKey,
    label,
    count,
  }: {
    tabKey: "volunteers" | "applications";
    label: string;
    count: number;
  }) => (
    <button
      onClick={() => setActiveTab(tabKey)}
      className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
        activeTab === tabKey
          ? "text-verdant-600 border-verdant-600 bg-verdant-50"
          : "text-shark-600 border-transparent hover:text-verdant-600 hover:border-verdant-300"
      }`}
    >
      {label} ({count})
    </button>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white mb-6 mt-2">
        <div className="px-6 py-8">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-verdant-600" />
            <div>
              <h1 className="text-3xl font-bold text-shark-950 font-secondary">
                Event Volunteers
              </h1>
              <p className="text-shark-600 mt-2 font-secondary">
                Manage event volunteers and review volunteer applications
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-6 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <TabButton
              tabKey="volunteers"
              label="Event Volunteers"
              count={eventVolunteers.length}
            />
            <TabButton
              tabKey="applications"
              label="Volunteer Applications"
              count={volunteerApplications.length}
            />
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6">
        {activeTab === "volunteers" && (
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-shark-950 font-secondary mb-1">
                Event Volunteers
              </h2>
              <p className="text-shark-600 font-secondary">
                Volunteers who are selected and confirmed for this event
              </p>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-shark-600">
                  Loading event volunteers...
                </div>
              </div>
            ) : (
              <Table columns={eventVolunteersColumns} data={eventVolunteers} />
            )}
          </div>
        )}

        {activeTab === "applications" && (
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-shark-950 font-secondary mb-1">
                Volunteer Applications
              </h2>
              <p className="text-shark-600 font-secondary">
                Review and manage volunteer applications for this event
              </p>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-shark-600">
                  Loading volunteer applications...
                </div>
              </div>
            ) : (
              <Table
                columns={volunteerApplicationsColumns}
                data={volunteerApplications}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventVolunteersPage;
