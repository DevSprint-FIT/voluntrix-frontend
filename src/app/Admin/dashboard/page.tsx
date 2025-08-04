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
  Heart, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/react";

// Dummy data for admin dashboard
const dummyStats = {
  totalUsers: 1247,
  totalOrganizations: 89,
  totalVolunteers: 934,
  totalSponsors: 224,
  activeEvents: 45,
  totalDonations: 485000,
  pendingApprovals: 12,
  monthlyGrowth: 8.5
};

const dummyRecentUsers = [
  { id: 1, name: "Sarah Johnson", email: "sarah@email.com", role: "VOLUNTEER", joinDate: "2025-08-01", status: "active" },
  { id: 2, name: "Green Earth Foundation", email: "contact@greenearth.org", role: "ORGANIZATION", joinDate: "2025-08-02", status: "pending" },
  { id: 3, name: "Tech Corp Ltd", email: "sponsor@techcorp.com", role: "SPONSOR", joinDate: "2025-08-03", status: "active" },
  { id: 4, name: "John Doe", email: "john@email.com", role: "VOLUNTEER", joinDate: "2025-08-04", status: "active" },
];

const dummyRecentEvents = [
  { id: 1, title: "Beach Cleanup Drive", organization: "Ocean Care", date: "2025-08-15", volunteers: 25, status: "upcoming" },
  { id: 2, title: "Food Distribution", organization: "Help Foundation", date: "2025-08-12", volunteers: 15, status: "ongoing" },
  { id: 3, title: "Tree Planting", organization: "Green Earth", date: "2025-08-10", volunteers: 30, status: "completed" },
  { id: 4, title: "Education Workshop", organization: "Learn Together", date: "2025-08-20", volunteers: 12, status: "upcoming" },
];

const dummyPendingApprovals = [
  { id: 1, type: "Organization", name: "New Hope Foundation", submittedDate: "2025-08-03", priority: "high" },
  { id: 2, type: "Event", name: "Community Outreach Program", submittedDate: "2025-08-04", priority: "medium" },
  { id: 3, type: "Sponsor", name: "Local Business Group", submittedDate: "2025-08-02", priority: "low" },
];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-verdant-600';
      case 'pending': return 'text-yellow-600';
      case 'upcoming': return 'text-blue-600';
      case 'ongoing': return 'text-verdant-600';
      case 'completed': return 'text-shark-400';
      default: return 'text-shark-600';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'VOLUNTEER': return 'bg-blue-100 text-blue-800';
      case 'ORGANIZATION': return 'bg-verdant-100 text-verdant-800';
      case 'SPONSOR': return 'bg-purple-100 text-purple-800';
      default: return 'bg-shark-100 text-shark-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-shark-600';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-shark-900 font-secondary">Admin Dashboard</h1>
              <p className="text-shark-600 font-primary">Welcome back, {user?.fullName}</p>
            </div>
            <div className="text-sm text-shark-500 font-primary">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={dummyStats.totalUsers.toLocaleString()}
            icon={<Users size={20} />}
          />
          <StatCard
            title="Organizations"
            value={dummyStats.totalOrganizations}
            icon={<Building2 size={20} />}
          />
          <StatCard
            title="Active Events"
            value={dummyStats.activeEvents}
            icon={<Calendar size={20} />}
          />
          <StatCard
            title="Total Donations"
            value={`LKR ${dummyStats.totalDonations.toLocaleString()}`}
            icon={<Heart size={20} />}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Volunteers"
            value={dummyStats.totalVolunteers.toLocaleString()}
            icon={<Users size={20} />}
          />
          <StatCard
            title="Sponsors"
            value={dummyStats.totalSponsors}
            icon={<Building2 size={20} />}
          />
          <StatCard
            title="Pending Approvals"
            value={dummyStats.pendingApprovals}
            icon={<AlertCircle size={20} />}
          />
          <StatCard
            title="Monthly Growth"
            value={`+${dummyStats.monthlyGrowth}%`}
            icon={<TrendingUp size={20} />}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <Card className="shadow-sm">
            <CardHeader>
              <h3 className="text-lg font-semibold text-shark-900 font-secondary">Recent Users</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {dummyRecentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-shark-900 font-primary">{user.name}</h4>
                      <p className="text-sm text-shark-600 font-primary">{user.email}</p>
                      <p className="text-xs text-shark-500 font-primary">Joined: {user.joinDate}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                      <span className={`text-sm font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Recent Events */}
          <Card className="shadow-sm">
            <CardHeader>
              <h3 className="text-lg font-semibold text-shark-900 font-secondary">Recent Events</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {dummyRecentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-shark-900 font-primary">{event.title}</h4>
                      <p className="text-sm text-shark-600 font-primary">by {event.organization}</p>
                      <p className="text-xs text-shark-500 font-primary">Date: {event.date}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm text-shark-600 font-primary">
                        {event.volunteers} volunteers
                      </span>
                      <span className={`text-sm font-medium ${getStatusColor(event.status)} flex items-center gap-1`}>
                        {event.status === 'completed' && <CheckCircle size={14} />}
                        {event.status === 'ongoing' && <Clock size={14} />}
                        {event.status === 'upcoming' && <Calendar size={14} />}
                        {event.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Pending Approvals */}
        <div className="mt-8">
          <Card className="shadow-sm">
            <CardHeader>
              <h3 className="text-lg font-semibold text-shark-900 font-secondary">Pending Approvals</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {dummyPendingApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-shark-900 font-primary">{approval.name}</h4>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {approval.type}
                        </span>
                      </div>
                      <p className="text-sm text-shark-600 font-primary mt-1">
                        Submitted: {approval.submittedDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-medium ${getPriorityColor(approval.priority)}`}>
                        {approval.priority} priority
                      </span>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-verdant-600 text-white text-sm font-medium rounded-md hover:bg-verdant-700 transition-colors">
                          Approve
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors">
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
