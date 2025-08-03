"use client";

import React, { useState, useEffect } from "react";
import { Crown, BarChart3, DollarSign, Eye } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  volunteerDashboardService,
  DashboardData,
  ContributionData,
} from "@/services/volunteerDashboardService";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";
import ProfileIndicator from "@/components/UI/ProfileIndicator";
import { User } from "@/services/authService";

interface User {
  userId: number;
  email: string;
  fullName: string;
  handle: string;
  role: string;
  emailVerified: boolean;
  profileCompleted: boolean;
  authProvider: string;
  createdAt: string;
  lastLogin: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "text-gray-600",
  bgColor = "bg-gray-50",
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  color?: string;
  bgColor?: string;
}) => (
  <div className="bg-[#FBFBFB] rounded-lg p-6">
    <div className="flex items-start space-x-6">
      <div
        className={`p-4 rounded-full ${bgColor} flex items-center justify-center`}
      >
        <Icon size={32} className={color} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-[#B0B0B0] mb-1 font-secondary">{title}</p>
        <p className="text-2xl font-bold text-gray-900 font-secondary">
          {value}
        </p>
      </div>
    </div>
  </div>
);

const ContributionGrid = ({ data }: { data: ContributionData[] }) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Create a grid of weeks for the year 2025 (Jan to Dec)
  const weeks = [];
  let currentWeek = [];

  // Start from January 1, 2025
  const startDate = new Date("2025-01-01");
  const endDate = new Date("2025-12-31");

  const currentDate = new Date(startDate);

  // Add empty cells for days before the start
  const startDayOfWeek = startDate.getDay();
  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push(null);
  }

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split("T")[0];
    const dayData = data.find((d) => d.date === dateString);
    const contributions = dayData ? dayData.contributions : 0;

    currentWeek.push({
      date: dateString,
      contributions,
      day: currentDate.getDate(),
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    // Fill remaining days of the last week
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 font-secondary">
          {volunteerDashboardService.calculateTotalContributions(data)}{" "}
          Contributions in This Year
        </h3>
      </div>

      {/* Main grid container */}
      <div className="flex items-start space-x-1">
        {/* Days of week labels */}
        <div className="w-10 text-right pr-2">
          {/* Empty space for month labels alignment */}
          <div className="h-5 mb-2"></div>
          {/* Day labels */}
          <div className="space-y-1">
            {days.map((day, index) => (
              <div
                key={index}
                className="h-3 text-xs text-[#B0B0B0] font-secondary flex items-center justify-end"
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Month labels and contribution grid */}
        <div className="flex-1">
          {/* Month labels */}
          <div className="flex justify-between text-xs text-[#B0B0B0] mb-2 font-secondary h-5">
            {months.map((month, index) => (
              <span
                key={index}
                className="text-center flex items-center justify-center flex-1"
              >
                {month}
              </span>
            ))}
          </div>

          {/* Contribution grid */}
          <div className="flex space-x-2">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="space-y-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm ${
                      day
                        ? volunteerDashboardService.getContributionIntensity(
                            day.contributions
                          )
                        : "bg-transparent"
                    }`}
                    title={
                      day
                        ? `${day.contributions} contributions on ${day.date}`
                        : ""
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-end mt-4 mr-8">
        <div className="flex items-center space-x-2 text-xs text-[#B0B0B0] font-secondary">
          <span>Less</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-gray-200 rounded-sm" />
            <div className="w-3 h-3 bg-green-400 rounded-sm" />
            <div className="w-3 h-3 bg-green-500 rounded-sm" />
            <div className="w-3 h-3 bg-green-600 rounded-sm" />
            <div className="w-3 h-3 bg-green-700 rounded-sm" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

const VolunteerDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [totalContributionsFromChart, setTotalContributionsFromChart] =
    useState(0);

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.replace("/auth/login");
          return;
        }

        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          router.replace("/auth/login");
          return;
        }

        // Check if profile is completed
        if (!currentUser.profileCompleted) {
          console.log(currentUser);
          router.replace("/auth/profile-form?type=volunteer");
          return;
        }

        setUser(currentUser);

        // Fetch dashboard data after authentication is confirmed
        await fetchDashboardData();
      } catch (error) {
        console.error("Auth check error:", error);
        router.replace("/auth/signup");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await volunteerDashboardService.getDashboardData();
      setDashboardData(data);

      // Calculate total from monthly contributions for the chart
      const chartTotal = data.monthlyContributions.reduce(
        (total, month) => total + month.contributions,
        0
      );
      setTotalContributionsFromChart(chartTotal);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#029972] mx-auto mb-4"></div>
          <p className="text-gray-600 font-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4 font-secondary">Error: {error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-secondary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-[#B0B0B0] font-secondary">
          No dashboard data available.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-9 py-4">
        <div className="flex justify-between items-start">
          <div>
            <nav className="text-[#B0B0B0] mb-2 mt-3 font-secondary">
              Volunteer / Dashboard
            </nav>
            <h1 className="text-2xl font-bold text-gray-900 font-secondary">
              Main Dashboard
            </h1>
          </div>
          <div className="mt-3">
            <ProfileIndicator />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Current Level"
              value={`Level ${dashboardData.currentLevel}`}
              icon={Crown}
              color="text-[#029972]"
              bgColor="bg-[#ECFDF6]"
            />
            <StatCard
              title="Total Volunteering"
              value={`${dashboardData.totalVolunteeringEvents} Events`}
              icon={BarChart3}
              color="text-[#029972]"
              bgColor="bg-[#ECFDF6]"
            />
            <StatCard
              title="Total Donations"
              value={`LKR ${dashboardData.totalDonations.toLocaleString()}`}
              icon={DollarSign}
              color="text-[#029972]"
              bgColor="bg-[#ECFDF6]"
            />
            <StatCard
              title="Total Profile Views"
              value="5"
              icon={Eye}
              color="text-[#029972]"
              bgColor="bg-[#ECFDF6]"
            />
          </div>

          {/* Contribution Calendar */}
          <div className="bg-[#FBFBFB] rounded-lg p-6 mb-8">
            <ContributionGrid data={dashboardData.contributionsData} />
          </div>

          {/* Contributions Chart */}
          <div className="bg-[#FBFBFB] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-secondary">
                    <span>{selectedYear}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div>
                <span className="text-3xl font-bold text-gray-900 font-secondary">
                  LKR {totalContributionsFromChart.toLocaleString()}
                </span>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-[#B0B0B0] font-secondary">
                    Total Monthly Donations
                  </span>
                </div>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.monthlyContributions}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#10B981",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                    }}
                    labelStyle={{
                      color: "white",
                    }}
                    itemStyle={{
                      color: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="contributions"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                    activeDot={{
                      r: 6,
                      fill: "white",
                      stroke: "#10B981",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
