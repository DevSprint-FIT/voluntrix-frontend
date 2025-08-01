"use client";

import React, { useState, useEffect } from "react";
import { Users, Check, X } from "lucide-react";
import Table, { Column } from "@/components/UI/Table";
import {
  getEventApplicAndVol,
  updateEventApplicationStatus,
} from "@/services/eventApplicationService";
import { EventApplicAndVolType } from "@/types/EventApplicAndVolType";
import { createVolunteerEventParticipation } from "@/services/volunteerEventParticipationService";
import { recruitVolunteer } from "@/services/eventService";

const EventVolunteersPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const [activeTab, setActiveTab] = useState<"volunteers" | "applications">(
    "volunteers"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [eventVolunteers, setEventVolunteers] = useState<
    EventApplicAndVolType[]
  >([]);
  const [volunteerApplications, setVolunteerApplications] = useState<
    EventApplicAndVolType[]
  >([]);
  const resolvedParams = React.use(params);
  const eventId = Number(resolvedParams.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response: EventApplicAndVolType[] = await getEventApplicAndVol(
          eventId
        );
        console.log("Fetched volunteer data:", response);

        const volunteers: EventApplicAndVolType[] = response.filter(
          (item) => item.applicationStatus === "APPROVED"
        );

        const applications: EventApplicAndVolType[] = response.filter(
          (item) => item.applicationStatus === "PENDING"
        );

        setEventVolunteers(volunteers);
        setVolunteerApplications(applications);
      } catch (error) {
        console.error("Error fetching volunteer data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const handleApproveApplication = async (id: number) => {
    console.log("Approved volunteer application:", id);
    try {
      const updatedApp = await updateEventApplicationStatus(id, "APPROVED");
      console.log("Application approved successfully:", updatedApp);

      const approvedApp = volunteerApplications.find((app) => app.id === id);
      console.log("Payload to backend:", {
        eventId: approvedApp?.eventId,
        volunteerId: approvedApp?.volunteerId,
        contributionArea: approvedApp?.contributionArea,
      });
      if (approvedApp) {
        await createVolunteerEventParticipation(
          approvedApp.eventId,
          approvedApp.volunteerId,
          approvedApp.contributionArea
        );
      }

      const volCount = await recruitVolunteer(eventId);
      console.log("Volunteer recruited successfully:", volCount);

      setVolunteerApplications((prevApplications) => {
        const approvedApp = prevApplications.find((app) => app.id === id);
        const updatedApplications = prevApplications.filter(
          (app) => app.id !== id
        );

        if (approvedApp) {
          setEventVolunteers((prevVolunteers) => {
            const exists = prevVolunteers.some(
              (vol) => vol.id === approvedApp.id
            );
            if (exists) return prevVolunteers;

            return [
              ...prevVolunteers,
              { ...approvedApp, applicationStatus: "APPROVED" },
            ];
          });
        }

        return updatedApplications;
      });
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  const handleRejectApplication = async (id: number) => {
    console.log("Rejected volunteer application:", id);
    try {
      await updateEventApplicationStatus(id, "REJECTED");
      setVolunteerApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "DESIGN":
        return "bg-verdant-100 text-verdant-800";
      case "EDITORIAL":
        return "bg-verdant-200 text-verdant-900";
      case "LOGISTICS":
        return "bg-shark-100 text-shark-800";
      case "PROGRAM":
        return "bg-shark-200 text-shark-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Table configurations
  const eventVolunteersColumns: Column<EventApplicAndVolType>[] = [
    {
      header: "Volunteer",
      accessor: "volunteerName",
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

  const volunteerApplicationsColumns: Column<EventApplicAndVolType>[] = [
    {
      header: "Volunteer",
      accessor: "volunteerName",
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
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleApproveApplication(value as number)}
            className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
            title="Approve Application"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => handleRejectApplication(value as number)}
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
      className={`px-6 py-3 font-bold text-base font-secondary border-b-2 transition-colors ${
        activeTab === tabKey
          ? "text-verdant-600 border-verdant-600 bg-verdant-50"
          : "text-shark-700 border-transparent hover:text-verdant-600 hover:border-verdant-600"
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
      <div className="px-6 mb-14">
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
