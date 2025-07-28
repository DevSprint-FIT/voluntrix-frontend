const API_BASE_URL = "http://localhost:8080/api";

export interface VolunteerProfile {
  volunteerId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  institute: string;
  isAvailable: boolean;
  volunteerLevel: number;
  rewardPoints: number;
  isEventHost: boolean;
  joinedDate: number[];
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
  // Get volunteer profile by username
  async getVolunteerProfile(username: string): Promise<VolunteerProfile> {
    const response = await fetch(
      `${API_BASE_URL}/public/volunteers/${username}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch volunteer profile");
    }
    return response.json();
  },

  // Get volunteer participation stats
  async getVolunteerStats(volunteerId: number): Promise<VolunteerStats> {
    const response = await fetch(
      `${API_BASE_URL}/public/participations/volunteer/${volunteerId}/stats`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch volunteer stats");
    }
    return response.json();
  },

  // Get total donations for volunteer
  async getTotalDonations(volunteerId: number): Promise<number> {
    const response = await fetch(
      `${API_BASE_URL}/analytics/volunteer/${volunteerId}/donations/total`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch total donations");
    }
    const result = await response.json();
    return result || 0;
  },

  // Get monthly donations for volunteer
  async getMonthlyDonations(
    volunteerId: number,
    year: number
  ): Promise<MonthlyDonationDto[]> {
    const response = await fetch(
      `${API_BASE_URL}/analytics/volunteer/${volunteerId}/donations/monthly?year=${year}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch monthly donations");
    }
    return response.json();
  },

  // Get task submitted dates for contribution grid
  async getTaskSubmittedDates(assigneeId: number): Promise<number[][]> {
    const response = await fetch(
      `${API_BASE_URL}/public/tasks/assignee/${assigneeId}/submitted-dates`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch task submitted dates");
    }
    return response.json();
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

  // Get complete dashboard data
  async getDashboardData(
    username: string,
    volunteerId: number
  ): Promise<DashboardData> {
    try {
      const [profile, stats, totalDonations, monthlyDonations, submittedDates] =
        await Promise.all([
          this.getVolunteerProfile(username),
          this.getVolunteerStats(volunteerId),
          this.getTotalDonations(volunteerId),
          this.getMonthlyDonations(volunteerId, 2025),
          this.getTaskSubmittedDates(volunteerId), // assigneeId is same as volunteerId
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
    if (contributions === 0) return "bg-gray-100";
    if (contributions === 1) return "bg-green-300";
    if (contributions === 2) return "bg-green-400";
    if (contributions === 3) return "bg-green-500";
    return "bg-green-600";
  },

  // Calculate total contributions for the year
  calculateTotalContributions(contributionsData: ContributionData[]): number {
    return contributionsData.reduce(
      (total, day) => total + day.contributions,
      0
    );
  },
};
