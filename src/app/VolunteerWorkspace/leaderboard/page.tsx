"use client";

import React from "react";
import { Trophy, Medal, Award, Star } from "lucide-react";

interface Volunteer {
  id: string;
  name: string;
  avatar?: string;
  rewardPoints: number;
}

const LeaderboardPage = () => {
  // Dummy data for volunteers
  const volunteersData: Volunteer[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      rewardPoints: 1250,
    },
    {
      id: "2",
      name: "Michael Chen",
      rewardPoints: 1180,
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      rewardPoints: 1050,
    },
    {
      id: "4",
      name: "David Wilson",
      rewardPoints: 920,
    },
    {
      id: "5",
      name: "Lisa Thompson",
      rewardPoints: 885,
    },
    {
      id: "6",
      name: "James Anderson",
      rewardPoints: 760,
    },
    {
      id: "7",
      name: "Maria Garcia",
      rewardPoints: 645,
    },
    {
      id: "8",
      name: "Robert Taylor",
      rewardPoints: 520,
    },
  ];

  // Sort volunteers by reward points (descending) and add rank
  const volunteers = volunteersData
    .sort((a, b) => b.rewardPoints - a.rewardPoints)
    .map((volunteer, index) => ({
      ...volunteer,
      rank: index + 1,
    }));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <Star className="h-6 w-6 text-verdant-600" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 2:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case 3:
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-verdant-100 text-verdant-800 border-verdant-200";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="px-6 py-8">
          <div className="flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-verdant-600" />
            <h1 className="text-3xl font-bold text-shark-950 font-secondary">
              Event Leaderboard
            </h1>
          </div>
          <p className="text-shark-600 mt-2 font-primary">
            Top performing volunteers ranked by reward points earned
          </p>
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="px-6">
        {/* Full Leaderboard Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-shark-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-shark-500 uppercase tracking-wider">
                    Volunteer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-shark-500 uppercase tracking-wider">
                    Reward Points
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {volunteers.map((volunteer) => (
                  <tr
                    key={volunteer.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRankBadgeColor(
                            volunteer.rank
                          )}`}
                        >
                          #{volunteer.rank}
                        </span>
                        {getRankIcon(volunteer.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-verdant-100 rounded-full flex items-center justify-center">
                          <span className="text-verdant-700 font-medium text-sm">
                            {getInitials(volunteer.name)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-shark-950">
                            {volunteer.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-verdant-600">
                        {volunteer.rewardPoints} pts
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
