export interface LeaderboardParticipant {
  firstName: string;
  lastName: string;
  eventRewardPoints: number;
  profilePictureUrl?: string;
}

export interface EventDetails {
  eventId: number;
  eventTitle: string;
  eventDescription: string;
  eventLocation: string;
  eventStartDate: string;
  eventEndDate: string;
  eventTime: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  eventImageUrl: string;
  volunteerCount: number;
  eventType: "ONLINE" | "ONSITE";
  eventVisibility: "PRIVATE" | "PUBLIC";
  eventStatus: "DRAFT" | "ACTIVE" | "COMPLETE" | "PENDING" | "DENIED";
  sponsorshipEnabled: boolean;
  donationEnabled: boolean;
  categories: Array<{
    categoryId: number;
    categoryName: string;
  }>;
  eventHostId: number;
  organizationId: number;
  eventHostRewardPoints: number;
}

export interface ProcessedLeaderboardEntry {
  id: string;
  name: string;
  eventRewardPoints: number;
  profilePictureUrl?: string;
  rank: number;
  isEventHost?: boolean;
}

const API_BASE_URL = "http://localhost:8080/api/public";

export const eventLeaderboardService = {
  /**
   * Fetch leaderboard data for volunteers participating in an event
   */
  async getEventLeaderboard(
    eventId: number
  ): Promise<LeaderboardParticipant[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/participations/event/${eventId}/leaderboard`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching event leaderboard:", error);
      throw error;
    }
  },

  /**
   * Fetch event details including event host reward points
   */
  async getEventDetails(eventId: number): Promise<EventDetails> {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch event details: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching event details:", error);
      throw error;
    }
  },

  /**
   * Process leaderboard data for volunteers only
   */
  processVolunteerLeaderboardData(
    participants: LeaderboardParticipant[]
  ): ProcessedLeaderboardEntry[] {
    // Convert participants to processed entries (data is already sorted from backend)
    const entries: ProcessedLeaderboardEntry[] = participants.map(
      (participant, index) => ({
        id: `volunteer-${index}`,
        name: `${participant.firstName} ${participant.lastName}`,
        eventRewardPoints: participant.eventRewardPoints,
        profilePictureUrl: participant.profilePictureUrl,
        rank: 0, // Will be set based on points
        isEventHost: false,
      })
    );

    // Assign ranks handling ties properly
    let currentRank = 1;
    for (let i = 0; i < entries.length; i++) {
      if (
        i > 0 &&
        entries[i].eventRewardPoints < entries[i - 1].eventRewardPoints
      ) {
        // Points are different, update rank to current position + 1
        currentRank = i + 1;
      }
      entries[i].rank = currentRank;
    }

    return entries;
  },

  /**
   * Get complete leaderboard data for volunteers only
   */
  async getVolunteerLeaderboard(
    eventId: number
  ): Promise<ProcessedLeaderboardEntry[]> {
    const participants = await this.getEventLeaderboard(eventId);
    return this.processVolunteerLeaderboardData(participants);
  },

  /**
   * Get volunteer leaderboard data and event host points separately
   */
  async getEventHostViewData(eventId: number): Promise<{
    volunteerLeaderboard: ProcessedLeaderboardEntry[];
    eventHostPoints: number;
  }> {
    const [participants, eventDetails] = await Promise.all([
      this.getEventLeaderboard(eventId),
      this.getEventDetails(eventId),
    ]);

    return {
      volunteerLeaderboard: this.processVolunteerLeaderboardData(participants),
      eventHostPoints: eventDetails.eventHostRewardPoints,
    };
  },
};
