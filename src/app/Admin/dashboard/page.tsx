"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/services/authService";
import authService from "@/services/authService";
import StatCard from "@/components/UI/StatCard";
import { 
  Users, 
  Calendar, 
  Building2, 
  Heart
} from "lucide-react";

// No dummy data - indicating backend implementation needed
const dummyStats = {
  totalUsers: 0,
  totalOrganizations: 0,
  activeEvents: 0,
  totalDonations: 0,
};

const dummyRecentActivities: Array<{id: number, type: string, message: string, time: string}> = [];

const dummyPendingApprovals: Array<{id: number, type: string, name: string, priority: string}> = [];

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.replace('/auth/login');
          return;
        }

        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          router.replace('/auth/login');
          return;
        }

        // Check if user is admin (you can modify this check based on your role system)
        if (currentUser.role !== 'ADMIN') {
          router.replace('/auth/unauthorized');
          return;
        }

        setUser(currentUser);
      } catch (error) {
        console.error('Auth check error:', error);
        router.replace('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [router]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-shark-600';
    }
  };

  const getActivityTypeDisplay = (type: string) => {
    switch (type) {
      case 'user': return 'User Registration';
      case 'event': return 'Event Creation';
      case 'organization': return 'Organization Registration';
      case 'donation': return 'Donation Received';
      default: return 'System Activity';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 border-4 border-verdant-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-verdant-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-shark-600 font-primary">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 m-5">
      {/* Title with Admin Info */}
      <div className="flex justify-between items-center mb-6">
        {/* Left Side: Title */}
        <div>
          <span className="text-shark-300">Admin / Dashboard</span>
          <h1 className="text-2xl font-primary font-bold mt-1">Main Dashboard</h1>
        </div>

        {/* Right Side: Admin Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-verdant-100 flex items-center justify-center">
            <span className="text-verdant-600 font-bold text-lg">A</span>
          </div>
          <div>
            <h2 className="font-semibold font-secondary text-xl leading-tight">{user?.fullName}</h2> 
            <p className="font-secondary font-semibold text-shark-600 text-xs leading-tight">System Administrator</p>       
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="flex flex-wrap gap-10 mb-8">
        <StatCard 
          title="Total Users" 
          value={dummyStats.totalUsers === 0 ? "No Data" : dummyStats.totalUsers.toLocaleString()} 
          icon={<Users size={20} />} 
        />
        <StatCard 
          title="Organizations" 
          value={dummyStats.totalOrganizations === 0 ? "No Data" : dummyStats.totalOrganizations} 
          icon={<Building2 size={20} />} 
        />
        <StatCard 
          title="Active Events" 
          value={dummyStats.activeEvents === 0 ? "No Data" : dummyStats.activeEvents} 
          icon={<Calendar size={20} />} 
        />
        <StatCard 
          title="Total Donations" 
          value={dummyStats.totalDonations === 0 ? "No Data" : `LKR ${dummyStats.totalDonations.toLocaleString()}`} 
          icon={<Heart size={20} />} 
        />
      </div>

      {/* Dashboard Content Section */}
      <div className="flex gap-8 mb-8">
        {/* Recent Activities (left side) */}
        <div className="bg-[#FBFBFB] rounded-xl p-6 w-[25rem] h-[25rem]">
          <h2 className="text-lg font-secondary font-semibold mb-4">Recent Activities</h2>
          
          {dummyRecentActivities.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-medium text-shark-600 font-primary mb-2">No Recent Activities</h3>
                <p className="text-sm text-shark-500 font-primary">
                  Backend implementation needed to fetch activity data
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow-sm">
              <table className="min-w-full divide-y divide-shark-100 bg-white text-sm border-separate border-spacing-y-2">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left font-secondary text-shark-800">Type</th>
                    <th className="px-6 py-3 text-left font-secondary text-shark-800">Message</th>
                    <th className="px-6 py-3 text-left font-secondary text-shark-800">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyRecentActivities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                      <td style={{ backgroundColor: '#FBFBFB' }} className="px-6 py-4 text-shark-900 font-secondary">
                        {getActivityTypeDisplay(activity.type)}
                      </td>
                      <td style={{ backgroundColor: '#FBFBFB' }} className="px-6 py-4 text-shark-900 font-secondary">
                        {activity.message}
                      </td>
                      <td style={{ backgroundColor: '#FBFBFB' }} className="px-6 py-4 text-shark-900 font-secondary">
                        {activity.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Approvals (right side) */}
        <div className="bg-[#FBFBFB] rounded-xl p-6 flex-1 h-[25rem]">
          <h2 className="text-lg font-secondary font-semibold mb-4">Pending Approvals</h2>
          
          {dummyPendingApprovals.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Calendar className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-medium text-shark-600 font-primary mb-2">No Pending Approvals</h3>
                <p className="text-sm text-shark-500 font-primary">
                  Backend implementation needed to fetch approval data
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow-sm">
              <table className="min-w-full divide-y divide-shark-100 bg-white text-sm border-separate border-spacing-y-2">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left font-secondary text-shark-800">Type</th>
                    <th className="px-6 py-3 text-left font-secondary text-shark-800">Name</th>
                    <th className="px-6 py-3 text-left font-secondary text-shark-800">Priority</th>
                    <th className="px-6 py-3 text-left font-secondary text-shark-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyPendingApprovals.map((approval) => (
                    <tr key={approval.id} className="hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                      <td style={{ backgroundColor: '#FBFBFB' }} className="px-6 py-4 text-shark-900 font-secondary">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {approval.type}
                        </span>
                      </td>
                      <td style={{ backgroundColor: '#FBFBFB' }} className="px-6 py-4 text-shark-900 font-secondary">
                        {approval.name}
                      </td>
                      <td style={{ backgroundColor: '#FBFBFB' }} className="px-6 py-4 text-shark-900 font-secondary">
                        <span className={`text-sm font-medium ${getPriorityColor(approval.priority)}`}>
                          {approval.priority}
                        </span>
                      </td>
                      <td style={{ backgroundColor: '#FBFBFB' }} className="px-6 py-4 text-shark-900 font-secondary">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-verdant-600 text-white text-sm font-medium rounded-md hover:bg-verdant-700 transition-colors">
                            Approve
                          </button>
                          <button className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors">
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Platform Overview */}
      <div className="bg-[#FBFBFB] rounded-xl p-6">
        <h2 className="text-lg font-secondary font-semibold mb-4">Platform Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
            <h3 className="font-semibold text-shark-900 font-primary">User Growth</h3>
            <p className="text-2xl font-bold text-blue-600 font-primary">No Data</p>
            <p className="text-xs text-shark-500 font-primary">Backend implementation needed</p>
          </div>
          
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="w-12 h-12 mx-auto mb-3 bg-verdant-100 rounded-full flex items-center justify-center">
              <Calendar className="text-verdant-600" size={24} />
            </div>
            <h3 className="font-semibold text-shark-900 font-primary">Event Success</h3>
            <p className="text-2xl font-bold text-verdant-600 font-primary">No Data</p>
            <p className="text-xs text-shark-500 font-primary">Backend implementation needed</p>
          </div>
          
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
              <Heart className="text-purple-600" size={24} />
            </div>
            <h3 className="font-semibold text-shark-900 font-primary">Donations</h3>
            <p className="text-2xl font-bold text-purple-600 font-primary">No Data</p>
            <p className="text-xs text-shark-500 font-primary">Backend implementation needed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
