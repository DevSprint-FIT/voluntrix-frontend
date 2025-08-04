"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Table, { Column } from "@/components/UI/Table";
import {
  sponsorService,
  SponsorRequestTableDTO,
  SponsorshipPaymentStatus,
} from "@/services/sponsorService";

export default function SponsorApprovedSponsorshipsPage() {
  const [sponsorships, setSponsorships] = useState<SponsorRequestTableDTO[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSponsorships = async () => {
      try {
        setLoading(true);
        const approvedSponsorships =
          await sponsorService.getSponsorshipRequestsByStatus("APPROVED");
        setSponsorships(approvedSponsorships);
      } catch (error) {
        console.error("Error fetching approved sponsorships:", error);
        alert("Failed to load approved sponsorships. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSponsorships();
  }, []);

  const handlePayNow = (sponsorship: SponsorRequestTableDTO) => {
    router.push(`/sponsorship?requestId=${sponsorship.requestId}`);
  };

  const getPaymentStatusBadge = (status: SponsorshipPaymentStatus) => {
    const statusConfig = {
      FULLPAID: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Fully Paid",
      },
      PARTIALPAID: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Partially Paid",
      },
      UNPAID: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Unpaid",
      },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

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
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-verdant-100 text-verdant-800">
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
    {
      header: "Status",
      accessor: "paymentStatus",
      cell: (value) => getPaymentStatusBadge(value as SponsorshipPaymentStatus),
    },
    {
      header: "Action",
      accessor: "requestId",
      cell: (value, row) => {
        const canPay =
          row.paymentStatus === "UNPAID" || row.paymentStatus === "PARTIALPAID";
        return (
          <button
            onClick={() => handlePayNow(row)}
            disabled={!canPay}
            className={`px-4 py-2 rounded-full text-base font-primary tracking-wide transition-colors ${
              canPay
                ? "bg-shark-950 text-shark-50 hover:bg-shark-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Pay Now
          </button>
        );
      },
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
      <h1 className="text-2xl font-bold mb-4">Approved Sponsorships</h1>
      {sponsorships.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No approved sponsorships found
        </div>
      ) : (
        <Table columns={columns} data={sponsorships} />
      )}
    </div>
  );
}
