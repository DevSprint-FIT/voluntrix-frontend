"use client";

import React, { useState, useEffect } from "react";
import EventLeaderboard, {
  LeaderboardEntry,
} from "@/components/UI/EventLeaderboard";
import { eventLeaderboardService } from "@/services/eventLeaderboard";

const EventHostLeaderboardPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [eventHostPoints, setEventHostPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resolvedParams = React.use(params);

  const eventId = Number(resolvedParams.id);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await eventLeaderboardService.getEventHostViewData(
          eventId
        );
        setLeaderboardData(data.volunteerLeaderboard);
        setEventHostPoints(data.eventHostPoints);
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
      subtitle="Event host reward points and volunteer rankings for this event"
      isLoading={isLoading}
      error={error}
      eventHostPoints={eventHostPoints}
    />
  );
};

export default EventHostLeaderboardPage;
