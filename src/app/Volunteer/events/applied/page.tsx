"use client";

import { useEffect, useState } from "react";
import Table, { Column } from "@/components/UI/Table";
import {
  AppliedEvent,
  getVolunteerAppliedEvents,
  deleteEventApplication,
} from "@/services/volunteerEventService";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@heroui/button";

// Modal Component
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventName: string;
  isDeleting: boolean;
}

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  eventName,
  isDeleting,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">
            Confirm Cancellation
          </h2>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to cancel your application for{" "}
          <span className="font-medium text-gray-900">"{eventName}"</span>? This
          action cannot be undone.
        </p>

        <div className="flex justify-end space-x-3">
          <Button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            No, Keep Application
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Cancelling...
              </>
            ) : (
              "Yes, Cancel Application"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AppliedEventsPage() {
  const [events, setEvents] = useState<AppliedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AppliedEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const volunteerId = 1; // Replace with actual volunteer ID

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getVolunteerAppliedEvents(volunteerId);
      setEvents(data);
    } catch (error) {
      console.error("Failed to load applied events", error);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (event: AppliedEvent) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedEvent?.applicationId) return;

    setIsDeleting(true);
    try {
      await deleteEventApplication(selectedEvent.applicationId);

      // Remove the event from the local state
      setEvents((prevEvents) =>
        prevEvents.filter(
          (event) => event.applicationId !== selectedEvent.applicationId
        )
      );

      setModalOpen(false);
      setSelectedEvent(null);

      // You might want to show a success toast here
      console.log("Application cancelled successfully");
    } catch (error) {
      console.error("Failed to cancel application", error);
      // You might want to show an error toast here
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalClose = () => {
    if (!isDeleting) {
      setModalOpen(false);
      setSelectedEvent(null);
    }
  };

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
      accessor: "applicationId", // Using applicationId as accessor
      cell: (
        cellValue: AppliedEvent[keyof AppliedEvent],
        row: AppliedEvent
      ) => (
        <div className="flex items-center">
          <Button
            onClick={() => handleCancelClick(row)}
            className="rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors font-primary px-4 py-2"
          >
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
      ) : events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No applied events found.
        </div>
      ) : (
        <Table columns={columns} data={events} />
      )}

      <ConfirmModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirmCancel}
        eventName={selectedEvent?.eventName || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}
