import authService from '@/services/authService';
import axios from 'axios';

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
};

export interface VolunteerProfile {
  volunteerId: number;
  userId: number;
  username: string;
  fullName: string;
  email: string;
  institute: string | null;
  instituteEmail: string | null;
  isAvailable: boolean;
  volunteerLevel: number;
  rewardPoints: number;
  isEventHost: boolean;
  joinedDate: string;
  about: string;
  phoneNumber: string;
  profilePictureUrl: string;
}

export interface DashboardData {
  currentLevel: number;
  // totalVolunteeringEvents: number;
  contributionsData: ContributionData[];
}

export interface ContributionData {
  date: string;
  contributions: number;
}

export interface MonthlyContribution {
  month: string;
  contributions: number;
}

export const volunteerDashboardService = {
  async getVolunteerProfile(): Promise<VolunteerProfile> {
    try {
      const response = await fetch(`${getBaseUrl()}/api/volunteers/me`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch volunteer profile: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching volunteer profile:', error);
      throw error;
    }
  },

  // Get task submitted dates for contribution grid using JWT token
  async getTaskSubmittedDates(): Promise<number[][]> {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/tasks/assignee/submitted-dates`,
        {
          method: 'GET',
          headers: authService.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch task submitted dates: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching task submitted dates:', error);
      throw error;
    }
  },

  // Convert backend date format to contribution data
  processContributionDates(submittedDates: number[][]): ContributionData[] {
    const contributionMap = new Map<string, number>();

    // Process submitted dates
    submittedDates.forEach((dateArray) => {
      const [year, month, day] = dateArray;
      const dateString = `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;
      contributionMap.set(
        dateString,
        (contributionMap.get(dateString) || 0) + 1
      );
    });

    // Generate full year data (Jan to Dec 2025)
    const contributions: ContributionData[] = [];
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-12-31');

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      contributions.push({
        date: dateString,
        contributions: contributionMap.get(dateString) || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return contributions;
  },

  async fetchTotalEventsCountByHostId(): Promise<number> {
    try {
      const response = await axios.get(
        `${getBaseUrl()}/api/events/total-events-count`,
        {
          headers: authService.getAuthHeadersAxios(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching event count:', error);
      throw error;
    }
  },

  async fetchTotalEventHostRewardPoints(): Promise<number> {
    try {
      const response = await axios.get(
        `${getBaseUrl()}/api/events/total-event-host-reward-points`,
        {
          headers: authService.getAuthHeadersAxios(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching total event host reward points:', error);
      throw error;
    }
  },

  // Get complete dashboard data using JWT authentication
  async getDashboardData(): Promise<DashboardData> {
    try {
      const [profile, submittedDates, eventCount, rewardPoints] = await Promise.all([
        this.getVolunteerProfile(),
        this.getTaskSubmittedDates(),
        this.fetchTotalEventsCountByHostId(),
        this.fetchTotalEventHostRewardPoints(),
      ]);

      const contributionsData = this.processContributionDates(submittedDates);

      return {
        currentLevel: profile.volunteerLevel,
        contributionsData,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch dashboard data: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  },

  // Get contribution intensity level for styling
  getContributionIntensity(contributions: number): string {
    if (contributions === 0) return 'bg-gray-200';
    if (contributions === 1) return 'bg-green-400';
    if (contributions === 2) return 'bg-green-500';
    if (contributions === 3) return 'bg-green-600';
    return 'bg-green-700';
  },

  // Calculate total contributions for the year
  calculateTotalContributions(contributionsData: ContributionData[]): number {
    return contributionsData.reduce(
      (total, day) => total + day.contributions,
      0
    );
  },
};
