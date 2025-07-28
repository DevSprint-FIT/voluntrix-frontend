"use client";

import React, { useState, useEffect } from "react";
import EventLeaderboard, {
  LeaderboardEntry,
} from "@/components/UI/EventLeaderboard";
import { eventLeaderboardService } from "@/services/eventLeaderboard";

const VolunteerLeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hardcoded eventId for now - can be made dynamic later
  const eventId = 1;

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
