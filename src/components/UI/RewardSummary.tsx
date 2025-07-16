import { useState, useEffect } from 'react';
import { FaMedal, FaGift, FaFire } from 'react-icons/fa';
import { GiCoins } from 'react-icons/gi';
import { FiInfo } from 'react-icons/fi';
import { fetchVolunteerRewardStats } from '@/services/rewardService';

export default function RewardSummary() {
  const [streakProtection, setStreakProtection] = useState(false);
  const [volunteerData, setVolunteerData] = useState({
    name: '',
    totalRewardPoints: 0,
    level: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const username = 'anne13'; 

  useEffect(() => {
    const fetchVolunteerData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchVolunteerRewardStats(username);
        
        if (data) {
          setVolunteerData({
            name: data.name,
            totalRewardPoints: data.totalRewardPoints,
            level: parseInt(data.level, 10), 
          });
        } else {
          setError("Failed to fetch volunteer data");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
        console.error('Failed to fetch volunteer data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchVolunteerData();
    }
  }, [username]);

  const toggleStreakProtection = () => {
    setStreakProtection((prev) => !prev);
  };

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100 text-red-900 rounded p-8 shadow-sm flex justify-center items-center">
        <div className="text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-verdant-50 to-verdant-100 text-shark-900 rounded p-8 shadow-sm flex justify-between items-center flex-wrap gap-y-6">
      {/* Left side: Greeting */}
      <div className='pl-20'>
        <h2 className="text-4xl font-primary pb-2">
          Hi {loading ? (
            <span className="inline-block w-24 h-6 bg-shark-50 animate-pulse rounded"></span>
          ) : (
            volunteerData.name
          )}
        </h2>
        <div className="flex items-center gap-2 text-medium">
          <span>
            Level {loading ? (
              <span className="inline-block w-6 h-5 bg-shark-50 animate-pulse rounded"></span>
            ) : (
              volunteerData.level
            )}
          </span>
          <FiInfo className="inline text-shark-400" />
        </div>
      </div>

      {/* Right side: Summary items */}
      <div className="flex flex-wrap gap-20 items-center text-center justify-end pr-10">
        {/* Available Points */}
        <div>
          <div className="flex justify-center items-center gap-2">
            <FaMedal className="text-3xl text-verdant-700" />
            <span className="text-medium text-shark-800">Available points</span>
            <FiInfo className="text-gray-500 text-sm" />
          </div>
          <p className="text-3xl font-bold">
            {loading ? (
              <span className="inline-block w-12 h-8 bg-shark-100 animate-pulse rounded"></span>
            ) : (
              volunteerData.totalRewardPoints.toLocaleString()
            )}
          </p>
          <a href="/Reward/redeem" className="text-verdant-600 font-medium text-medium hover:underline">Redeem &gt;</a>
        </div>

        {/* Auto-redeem */}
        <div>
          <div className="flex justify-center items-center gap-2">
            <FaGift className="text-3xl text-verdant-700" />
            <span className="text-medium text-shark-800">Auto-redeem</span>
            <FiInfo className="text-gray-500 text-sm" />
          </div>
          <p className="text-3xl font-bold text-gray-500">-</p>
          <a href="/Reward/redeem" className="text-verdant-600 text-medium font-medium hover:underline">Setup &gt;</a>
        </div>

        {/* Today's Points */}
        <div>
          <div className="flex justify-center items-center gap-2">
            <GiCoins className="text-3xl text-yellow-500" />
            <span className="text-medium text-shark-800">Today's points</span>
            <FiInfo className="text-gray-500 text-sm" />
          </div>
          <p className="text-3xl font-bold">0</p>
          <a href="#" className="text-verdant-600 text-medium font-medium hover:underline">Points breakdown &gt;</a>
        </div>

        {/* Streak Count */}
        <div>
          <div className="flex justify-center items-center gap-2">
            <FaFire className="text-3xl text-red-500" />
            <span className="text-medium text-shark-800">Streak count</span>
            <FiInfo className="text-gray-500 text-sm" />
          </div>
          <p className="text-3xl font-bold">0</p>
          <div className="text-sm mt-1 flex justify-center items-center gap-2">
            {/* Toggle Switch */}
            <button
              onClick={toggleStreakProtection}
              className={`w-10 h-4 flex items-center rounded-full px-1 transition-colors duration-300 ${
                streakProtection ? 'bg-verdant-500' : 'bg-shark-200'
              }`}
            >
              <div
                className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${
                  streakProtection ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-shark-700">Streak protection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
