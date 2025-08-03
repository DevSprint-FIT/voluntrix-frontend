import authService from "@/services/authService";

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
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

export interface VolunteerStats {
  activeCount: number;
  completedCount: number;
  appliedCount: number;
}

export interface MonthlyDonationDto {
  month: number;
  total: number;
}

export interface DashboardData {
  currentLevel: number;
  totalVolunteeringEvents: number;
  totalDonations: number;
  totalProfileViews: number;
  contributionsData: ContributionData[];
  monthlyContributions: MonthlyContribution[];
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
  // Get volunteer profile using JWT token
  async getVolunteerProfile(): Promise<VolunteerProfile> {
    try {
      const response = await fetch(`${getBaseUrl()}/api/volunteers/me`, {
        method: "GET",
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
      console.error("Error fetching volunteer profile:", error);
      throw error;
    }
  },

  // Get volunteer participation stats using JWT token
  async getVolunteerStats(): Promise<VolunteerStats> {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/participations/volunteer/stats`,
        {
          method: "GET",
          headers: authService.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch volunteer stats: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching volunteer stats:", error);
      throw error;
    }
  },

  // Get total donations for volunteer using JWT token
  async getTotalDonations(): Promise<number> {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/analytics/volunteer/donations/total`,
        {
          method: "GET",
          headers: authService.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch total donations: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      return result || 0;
    } catch (error) {
      console.error("Error fetching total donations:", error);
      throw error;
    }
  },

  // Get monthly donations for volunteer using JWT token
  async getMonthlyDonations(year: number): Promise<MonthlyDonationDto[]> {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/analytics/volunteer/donations/monthly?year=${year}`,
        {
          method: "GET",
          headers: authService.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch monthly donations: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching monthly donations:", error);
      throw error;
    }
  },

  // Get task submitted dates for contribution grid using JWT token
  async getTaskSubmittedDates(): Promise<number[][]> {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/tasks/assignee/submitted-dates`,
        {
          method: "GET",
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
      console.error("Error fetching task submitted dates:", error);
      throw error;
    }
  },

  // Convert backend date format to contribution data
  processContributionDates(submittedDates: number[][]): ContributionData[] {
    const contributionMap = new Map<string, number>();

    // Process submitted dates
    submittedDates.forEach((dateArray) => {
      const [year, month, day] = dateArray;
      const dateString = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      contributionMap.set(
        dateString,
        (contributionMap.get(dateString) || 0) + 1
      );
    });

    // Generate full year data (Jan to Dec 2025)
    const contributions: ContributionData[] = [];
    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-12-31");

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split("T")[0];
      contributions.push({
        date: dateString,
        contributions: contributionMap.get(dateString) || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return contributions;
  },

  // Convert monthly donation data to chart format
  processMonthlyDonations(
    monthlyDonations: MonthlyDonationDto[]
  ): MonthlyContribution[] {
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    // Create map for easy lookup
    const donationMap = new Map<number, number>();
    monthlyDonations.forEach((donation) => {
      donationMap.set(donation.month, donation.total);
    });

    // Generate data for JAN to AUG
    const result: MonthlyContribution[] = [];
    for (let month = 1; month <= 8; month++) {
      result.push({
        month: monthNames[month - 1],
        contributions: donationMap.get(month) || 0,
      });
    }

    return result;
  },

  // Calculate total from monthly donations
  calculateTotalFromMonthly(monthlyDonations: MonthlyDonationDto[]): number {
    return monthlyDonations.reduce(
      (total, donation) => total + donation.total,
      0
    );
  },

  // Get complete dashboard data using JWT authentication
  async getDashboardData(): Promise<DashboardData> {
    try {
      const [profile, stats, totalDonations, monthlyDonations, submittedDates] =
        await Promise.all([
          this.getVolunteerProfile(),
          this.getVolunteerStats(),
          this.getTotalDonations(),
          this.getMonthlyDonations(2025),
          this.getTaskSubmittedDates(),
        ]);

      const totalVolunteeringEvents = stats.activeCount + stats.completedCount;
      const contributionsData = this.processContributionDates(submittedDates);
      const monthlyContributions =
        this.processMonthlyDonations(monthlyDonations);

      return {
        currentLevel: profile.volunteerLevel,
        totalVolunteeringEvents,
        totalDonations,
        totalProfileViews: 250, // Hardcoded as requested
        contributionsData,
        monthlyContributions,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch dashboard data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  // Get contribution intensity level for styling
  getContributionIntensity(contributions: number): string {
    if (contributions === 0) return "bg-gray-200";
    if (contributions === 1) return "bg-green-400";
    if (contributions === 2) return "bg-green-500";
    if (contributions === 3) return "bg-green-600";
    return "bg-green-700";
  },

  // Calculate total contributions for the year
  calculateTotalContributions(contributionsData: ContributionData[]): number {
    return contributionsData.reduce(
      (total, day) => total + day.contributions,
      0
    );
  },
};
