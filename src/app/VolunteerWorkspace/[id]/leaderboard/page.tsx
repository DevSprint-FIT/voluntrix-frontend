"use client";

import React, { useState, useEffect, use } from "react";
import EventLeaderboard, {
  LeaderboardEntry,
} from "@/components/UI/EventLeaderboard";
import { eventLeaderboardService } from "@/services/eventLeaderboard";

const VolunteerLeaderboardPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);
  const eventId = Number(resolvedParams.id);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await eventLeaderboardService.getVolunteerLeaderboard(
          eventId
        );
        setLeaderboardData(data);
      } catch (err) {
        console.error("Failed to fetch leaderboard data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load leaderboard data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verdant-600 mx-auto mb-4"></div>
          <p className="text-shark-600 font-secondary">
            Loading leaderboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <EventLeaderboard
      entries={leaderboardData}
      title="Event Leaderboard"
      subtitle="Top performing volunteers ranked by reward points earned"
      isLoading={isLoading}
      error={error}
    />
  );
};

export default VolunteerLeaderboardPage;
