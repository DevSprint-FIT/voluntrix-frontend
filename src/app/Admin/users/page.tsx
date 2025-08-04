"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Search, Eye, Edit, Trash2 } from "lucide-react";

// No dummy data - indicating backend implementation needed
const dummyUsers: Array<{
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  lastActive: string;
  eventsParticipated?: number;
  eventsHosted?: number;
  sponsorships?: number;
}> = [];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredUsers = dummyUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'VOLUNTEER': return 'bg-blue-100 text-blue-800';
      case 'ORGANIZATION': return 'bg-verdant-100 text-verdant-800';
      case 'SPONSOR': return 'bg-purple-100 text-purple-800';
      default: return 'bg-shark-100 text-shark-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-shark-100 text-shark-800';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-shark-900 font-secondary">User Management</h1>
        <p className="text-shark-600 font-primary">Manage all users on the platform</p>
      </div>
        {/* Filters */}
        <Card className="mb-6">
          <CardBody>
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-shark-400" size={20} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verdant-500 focus:border-transparent font-primary"
                />
              </div>

              {/* Role Filter */}
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verdant-500 focus:border-transparent font-primary"
              >
                <option value="all">All Roles</option>
                <option value="VOLUNTEER">Volunteers</option>
                <option value="ORGANIZATION">Organizations</option>
                <option value="SPONSOR">Sponsors</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verdant-500 focus:border-transparent font-primary"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </CardBody>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-shark-900 font-secondary">
              Users ({filteredUsers.length})
            </h3>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Join Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Last Active</th>
                    <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Activity</th>
                    <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-shark-900 font-primary">{user.name}</div>
                          <div className="text-sm text-shark-600 font-primary">{user.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-shark-600 font-primary">{user.joinDate}</td>
                      <td className="py-4 px-4 text-sm text-shark-600 font-primary">{user.lastActive}</td>
                      <td className="py-4 px-4 text-sm text-shark-600 font-primary">
                        {user.role === 'VOLUNTEER' && `${user.eventsParticipated} events`}
                        {user.role === 'ORGANIZATION' && `${user.eventsHosted} events hosted`}
                        {user.role === 'SPONSOR' && `${user.sponsorships} sponsorships`}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded text-shark-600">
                            <Eye size={16} />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded text-shark-600">
                            <Edit size={16} />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-shark-500 font-primary">
                  No users found matching your criteria.
                </div>
              )}
            </div>
          </CardBody>
        </Card>
    </div>
  );
}
