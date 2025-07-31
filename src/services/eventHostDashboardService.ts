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
  contributionsData: ContributionData[];
}

export interface ContributionData {
  date: string;
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
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data: VolunteerProfile = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching volunteer profile:', error);
      throw error;
    }
  },

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
          `Failed to fetch task submitted dates: ${response.statusText}`
        );
      }

      const data: number[][] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching task submitted dates:', error);
      throw error;
    }
  },

  processContributionDates(submittedDates: number[][]): ContributionData[] {
    const contributionMap = new Map<string, number>();

    submittedDates.forEach(([year, month, day]) => {
      const date = `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;
      contributionMap.set(date, (contributionMap.get(date) || 0) + 1);
    });

    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-12-31');
    const contributions: ContributionData[] = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      contributions.push({
        date: dateStr,
        contributions: contributionMap.get(dateStr) || 0,
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
      console.error('Error fetching event host reward points:', error);
      throw error;
    }
  },

  async getDashboardData(): Promise<DashboardData> {
    try {
      const [profile, submittedDates] = await Promise.all([
        this.getVolunteerProfile(),
        this.getTaskSubmittedDates(),
      ]);

      const contributionsData = this.processContributionDates(submittedDates);

      return {
        currentLevel: profile.volunteerLevel,
        contributionsData,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw new Error(
        `Failed to fetch dashboard data: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  },

  getContributionIntensity(contributions: number): string {
    if (contributions === 0) return 'bg-gray-200';
    if (contributions === 1) return 'bg-green-400';
    if (contributions === 2) return 'bg-green-500';
    if (contributions === 3) return 'bg-green-600';
    return 'bg-green-700';
  },

  calculateTotalContributions(contributionsData: ContributionData[]): number {
    return contributionsData.reduce(
      (sum, { contributions }) => sum + contributions,
      0
    );
  },
};
