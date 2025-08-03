"use client";

import React from "react";
import { Trophy, Medal, Award, Star } from "lucide-react";
import Image from "next/image";

export interface LeaderboardEntry {
  id: string;
  name: string;
  eventRewardPoints: number;
  profilePictureUrl?: string;
  rank: number;
}

interface EventLeaderboardProps {
  entries: LeaderboardEntry[];
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  error?: string | null;
  eventHostPoints?: number;
}

const EventLeaderboard: React.FC<EventLeaderboardProps> = ({
  entries,
  title = "Event Leaderboard",
  subtitle = "Top performing participants ranked by reward points earned",
  isLoading = false,
  error = null,
  eventHostPoints,
}) => {
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

  const getRankBadgeColor = () => {
    return "bg-verdant-100 text-verdant-800 border-verdant-200";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getRowBgColor = () => {
    return "bg-[#fbfbfb] hover:bg-verdant-50";
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-red-600">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-800">
                  Unable to load leaderboard
                </h3>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white mb-6 mt-2">
        <div className="px-6 py-8">
          <div className="flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-verdant-600" />
            <h1 className="text-3xl font-bold text-shark-950 font-secondary">
              {title}
            </h1>
          </div>
          <p className="text-shark-600 mt-2 font-secondary">{subtitle}</p>
        </div>
      </div>

      {/* Event Host Points Section (if provided) */}
      {eventHostPoints !== undefined && (
        <div className="px-6 mb-8">
          <div className="bg-gradient-to-r from-verdant-100 to-verdant-50 border border-verdant-200 rounded-xl p-6 shadow-sm max-w-md w-full mx-auto">
            <div className="flex items-center space-x-8">
              <div className="bg-verdant-500 rounded-full p-3">
                <Star className="h-6 w-6 text-white fill-current" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-shark-950 font-secondary">
                  Event Host Reward Points
                </h3>
                <p className="text-shark-600 text-sm font-secondary">
                  Points earned for hosting this event
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-verdant-600 font-secondary">
                  {eventHostPoints}
                </div>
                <div className="text-sm text-shark-600 font-secondary">
                  points
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="px-6">
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-12 mb-4 rounded"></div>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-6 border-b"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Leaderboard Content */
        <div className="px-6">
          {entries.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No participants yet
              </h3>
              <p className="text-gray-500">
                The leaderboard will show participants once they earn reward
                points.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead className="bg-white">
                    <tr>
                      <th className="w-1/3 px-6 py-4 text-center text-sm font-bold text-shark-700 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="w-1/3 px-6 py-4 text-left text-sm font-bold text-shark-700 uppercase tracking-wider pl-16">
                        Volunteer
                      </th>
                      <th className="w-1/3 px-6 py-4 text-center text-sm font-bold text-shark-700 uppercase tracking-wider">
                        Reward Points
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {entries.map((entry, index) => (
                      <React.Fragment key={entry.id}>
                        <tr className={`${getRowBgColor()} transition-colors`}>
                          <td className="px-6 py-5 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center space-x-2">
                              {getRankIcon(entry.rank)}
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRankBadgeColor()}`}
                              >
                                {entry.rank}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center space-x-6">
                              <div className="w-14 h-14 bg-verdant-100 rounded-full flex items-center justify-center overflow-hidden">
                                {entry.profilePictureUrl ? (
                                  <Image
                                    src={entry.profilePictureUrl}
                                    alt={entry.name}
                                    width={56}
                                    height={56}
                                    className="object-cover"
                                  />
                                ) : (
                                  <span className="text-verdant-700 font-medium text-sm">
                                    {getInitials(entry.name)}
                                  </span>
                                )}
                              </div>
                              <div className="text-base font-medium text-shark-950">
                                {entry.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-center">
                            <div className="text-base font-semibold text-shark-950">
                              {entry.eventRewardPoints} pts
                            </div>
                          </td>
                        </tr>
                        {index < entries.length - 1 && (
                          <tr className="bg-white">
                            <td className="px-6 py-2" colSpan={3}></td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventLeaderboard;
