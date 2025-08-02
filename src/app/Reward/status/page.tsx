"use client";
import { useEffect, useState } from "react";
import { fetchVolunteerRewardStats } from "@/services/rewardService";

export default function RewardStatus() {
  const [rewardStats, setRewardStats] = useState<{
    totalRewardPoints: number;
    level: string;
    name?: string;
    profilePictureUrl?: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchVolunteerRewardStats();
      if (data) {
        setRewardStats(data);
      }
    };
    fetchData();
  }, []);

  const isLoading = !rewardStats;

  const currentPoints = rewardStats?.totalRewardPoints ?? 0;
  const level = rewardStats ? parseInt(rewardStats.level) : 1;
  const nextLevelPoints =
    level === 1 ? 500 : level === 2 ? 1000 : currentPoints;

  const progress = Math.min((currentPoints / nextLevelPoints) * 100, 100);
  const lifetimePoints = currentPoints;
  const lifetimeRedeemed = 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-0">
      <div className="bg-white shadow-lg rounded-xl p-12 w-full flex flex-col items-center">
        <div className="flex w-full justify-between items-start mb-10">
          {/* Lifetime Points */}
          <div className="flex flex-col items-start" style={{ paddingLeft: "10rem" }}>
            <span className="text-shark-900 text-medium mt-2 order-2">Lifetime points earned</span>
            <div className="flex items-center order-1">
              {isLoading ? (
                <div className="w-32 h-10 bg-shark-50 rounded animate-pulse" />
              ) : (
                <span className="text-6xl font-bold text-shark-950">{lifetimePoints}</span>
              )}
            </div>
          </div>

          {/* Profile + Level + Progress */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-48 h-48 rounded-full bg-shark-100 border-4 shadow mb-4 overflow-hidden">
              {isLoading ? (
                <div className="w-full h-full bg-shark-50 animate-pulse" />
              ) : (
                <img
                  src={rewardStats.profilePictureUrl || "/default-profile.png"}
                  alt="Profile Picture"
                  className="w-full h-full object-cover object-top rounded-full"
                />
              )}
            </div>

            {isLoading ? (
              <div className="w-28 h-8 bg-shark-50 rounded animate-pulse mb-4" />
            ) : (
              <div className="text-shark-900 font-semibold text-4xl mb-2">Level {level}</div>
            )}

            <div className="w-64 bg-shark-100 rounded-full h-3 mb-2">
              {isLoading ? (
                <div className="w-1/2 h-3 bg-shark-50 rounded-full animate-pulse" />
              ) : (
                <div
                  className="bg-verdant-500 h-3 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              )}
            </div>

            {isLoading ? (
              <div className="w-48 h-4 bg-shark-50 rounded animate-pulse" />
            ) : (
              <div className="text-base text-shark-400">
                {Math.max(nextLevelPoints - currentPoints, 0)} points until Level {level + 1} 
              </div>
            )}
          </div>

          {/* Lifetime Redeemed */}
          <div className="flex flex-col items-end" style={{ paddingRight: "10rem" }}>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="w-32 h-10 bg-shark-50 rounded animate-pulse" />
              ) : (
                <span className="text-6xl font-bold text-shark-950">{lifetimeRedeemed}</span>
              )}
            </div>
            <span className="text-shark-900 text-medium mt-2">Lifetime points redeemed</span>
          </div>
        </div>
      </div>
    </div>
  );
}