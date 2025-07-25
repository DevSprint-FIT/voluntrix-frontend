const API_BASE_URL = "http://localhost:8080/api/public";

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
    const response = await fetch(`${API_BASE_URL}/volunteers/${username}`);
    if (!response.ok) {
      throw new Error("Failed to fetch volunteer profile");
    }
    return response.json();
  },

  // Get volunteer participation stats
  async getVolunteerStats(volunteerId: number): Promise<VolunteerStats> {
    const response = await fetch(
      `${API_BASE_URL}/participations/volunteer/${volunteerId}/stats`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch volunteer stats");
    }
    return response.json();
  },

  // Generate hardcoded contribution data for the year
  generateContributionData(): ContributionData[] {
    const contributions: ContributionData[] = [];
    const startDate = new Date("2024-03-01");
    const endDate = new Date("2025-03-31");

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const contributionCount = Math.floor(Math.random() * 5); // 0-4 contributions per day
      contributions.push({
        date: currentDate.toISOString().split("T")[0],
        contributions: contributionCount,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return contributions;
  },

  // Generate hardcoded monthly contribution data
  generateMonthlyContributions(): MonthlyContribution[] {
    const months = ["SEP", "OCT", "NOV", "DEC", "JAN", "FEB"];
    const contributions = [45, 52, 97, 32, 67, 73]; // Sample data matching the chart

    return months.map((month, index) => ({
      month,
      contributions: contributions[index],
    }));
  },

  // Get complete dashboard data
  async getDashboardData(
    username: string,
    volunteerId: number
  ): Promise<DashboardData> {
    try {
      const [profile, stats] = await Promise.all([
        this.getVolunteerProfile(username),
        this.getVolunteerStats(volunteerId),
      ]);

      const totalVolunteeringEvents = stats.activeCount + stats.completedCount;

      return {
        currentLevel: profile.volunteerLevel,
        totalVolunteeringEvents,
        totalDonations: 6500, // Hardcoded value
        totalProfileViews: 1000, // Hardcoded value (1k+)
        contributionsData: this.generateContributionData(),
        monthlyContributions: this.generateMonthlyContributions(),
      };
    } catch (error) {
      throw new Error("Failed to fetch dashboard data");
    }
  },

  // Get contribution intensity level for styling
  getContributionIntensity(contributions: number): string {
    if (contributions === 0) return "bg-gray-100";
    if (contributions === 1) return "bg-green-200";
    if (contributions === 2) return "bg-green-300";
    if (contributions === 3) return "bg-green-400";
    return "bg-green-500";
  },

  // Calculate total contributions for the year
  calculateTotalContributions(contributionsData: ContributionData[]): number {
    return contributionsData.reduce(
      (total, day) => total + day.contributions,
      0
    );
  },

  // Calculate percentage change (hardcoded for now)
  getPercentageChange(): string {
    return "+2.45%";
  },
};
