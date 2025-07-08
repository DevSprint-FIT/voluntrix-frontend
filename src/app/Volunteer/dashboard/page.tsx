"use client";

import React, { useState, useEffect } from "react";
import {
  Crown,
  BarChart3,
  DollarSign,
  Eye,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
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
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${bgColor}`}>
        <Icon size={24} className={color} />
      </div>
    </div>
  </div>
);

const ContributionGrid = ({ data }: { data: ContributionData[] }) => {
  const months = [
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
    "Jan",
    "Feb",
    "Mar",
  ];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Create a grid of weeks
  const weeks = [];
  let currentWeek = [];

  // Start from March 1, 2024
  const startDate = new Date("2024-03-01");
  const endDate = new Date("2025-03-31");

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
    weeks.push(currentWeek);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {volunteerDashboardService.calculateTotalContributions(data)}{" "}
          contributions in the last year
        </h3>
      </div>

      {/* Month labels */}
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        {months.map((month, index) => (
          <span key={index} className="text-center">
            {month}
          </span>
        ))}
      </div>

      {/* Days of week labels */}
      <div className="flex items-center space-x-1">
        <div className="w-8 text-right">
          <div className="space-y-1">
            {days.map((day, index) => (
              <div
                key={index}
                className={`h-3 text-xs text-gray-500 ${
                  index % 2 === 0 ? "block" : "hidden"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Contribution grid */}
        <div className="flex space-x-1">
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

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
        <span>Learn how we count contributions</span>
        <div className="flex items-center space-x-2">
          <span>Less</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-gray-100 rounded-sm" />
            <div className="w-3 h-3 bg-green-200 rounded-sm" />
            <div className="w-3 h-3 bg-green-300 rounded-sm" />
            <div className="w-3 h-3 bg-green-400 rounded-sm" />
            <div className="w-3 h-3 bg-green-500 rounded-sm" />
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

  // Using hardcoded values as specified
  const volunteerId = 1;
  const username = "anne13";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await volunteerDashboardService.getDashboardData(
          username,
          volunteerId
        );
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
        <p className="text-gray-600">No dashboard data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div>
          <nav className="text-sm text-gray-500 mb-2">
            Volunteer / Dashboard
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Main Dashboard</h1>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Current Level"
              value={`Level ${dashboardData.currentLevel}`}
              icon={Crown}
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            <StatCard
              title="Total Volunteering"
              value={`${dashboardData.totalVolunteeringEvents} Events`}
              icon={BarChart3}
              color="text-green-600"
              bgColor="bg-green-50"
            />
            <StatCard
              title="Total Donations"
              value={`LKR ${dashboardData.totalDonations.toLocaleString()}`}
              icon={DollarSign}
              color="text-purple-600"
              bgColor="bg-purple-50"
            />
            <StatCard
              title="Total Profile Views"
              value="1k+"
              icon={Eye}
              color="text-orange-600"
              bgColor="bg-orange-50"
            />
          </div>

          {/* Contribution Calendar */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <ContributionGrid data={dashboardData.contributionsData} />
          </div>

          {/* Contributions Chart */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                    <span>{selectedYear}</span>
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-gray-900">925</span>
                <span className="text-sm text-gray-500">
                  Total Contributions
                </span>
                <span className="flex items-center text-sm text-green-600 font-medium">
                  <TrendingUp size={16} className="mr-1" />
                  {volunteerDashboardService.getPercentageChange()}
                </span>
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
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="contributions"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#10B981" }}
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
