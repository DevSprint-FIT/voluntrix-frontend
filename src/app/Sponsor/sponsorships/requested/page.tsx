"use client";

import { useEffect, useState } from "react";
import Table, { Column } from "@/components/UI/Table";
import {
  sponsorService,
  SponsorRequestTableDTO,
} from "@/services/sponsorService";

export default function SponsorPendingSponsorshipsPage() {
  const [sponsorships, setSponsorships] = useState<SponsorRequestTableDTO[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsorships = async () => {
      try {
        setLoading(true);
        const pendingSponsorships =
          await sponsorService.getSponsorshipRequestsByStatus("PENDING");
        setSponsorships(pendingSponsorships);
      } catch (error) {
        console.error("Error fetching pending sponsorships:", error);
        alert("Failed to load pending sponsorships. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSponsorships();
  }, []);

  const columns: Column<SponsorRequestTableDTO>[] = [
    {
      header: "Event Name",
      accessor: "eventTitle",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      cell: (value, row) => (
        <div className="flex flex-col">
          <span className="font-bold">{value}</span>
        </div>
      ),
    },
    {
      header: "Event Date",
      accessor: "eventStartDate",
      cell: (value) => {
        const dateArray = value as number[];
        return <span>{sponsorService.formatDateArray(dateArray)}</span>;
      },
    },
    {
      header: "Sponsorship Type",
      accessor: "type",
      cell: (value) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      ),
    },
    {
      header: "Sponsorship Price",
      accessor: "price",
      cell: (value) => (
        <div className="flex items-center gap-1">
          <span className="font-semibold text-verdant-600">
            RS {value ? `${value.toLocaleString()}` : "N/A"}
          </span>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#029972] mx-auto mb-4"></div>
          <p className="text-gray-600 font-secondary">
            Loading sponsorships...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pending Sponsorships</h1>
      {sponsorships.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No pending sponsorships found
        </div>
      ) : (
        <Table columns={columns} data={sponsorships} />
      )}
    </div>
  );
}
