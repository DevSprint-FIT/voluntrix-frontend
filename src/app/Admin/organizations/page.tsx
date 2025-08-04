"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Search, Eye, Edit, Trash2, Building2 } from "lucide-react";

// No dummy data - indicating backend implementation needed
const dummyOrganizations: Array<{
  id: number;
  name: string;
  email: string;
  institute: string;
  status: string;
  joinDate: string;
  eventsHosted: number;
  followers: number;
  totalDonations: number;
}> = [];

export default function AdminOrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredOrganizations = dummyOrganizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.institute.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || org.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

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
        <h1 className="text-2xl font-bold text-shark-900 font-secondary">Organizations Management</h1>
        <p className="text-shark-600 font-primary">Manage all organizations on the platform</p>
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
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verdant-500 focus:border-transparent font-primary"
              />
            </div>

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

      {/* Organizations Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-shark-900 font-secondary">
            Organizations ({filteredOrganizations.length})
          </h3>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Organization</th>
                  <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Institute</th>
                  <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Join Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Events</th>
                  <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Followers</th>
                  <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Donations</th>
                  <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrganizations.map((org) => (
                  <tr key={org.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-verdant-100 rounded-full flex items-center justify-center">
                          <Building2 className="text-verdant-600" size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-shark-900 font-primary">{org.name}</div>
                          <div className="text-sm text-shark-600 font-primary">{org.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-shark-600 font-primary">{org.institute}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(org.status)}`}>
                        {org.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-shark-600 font-primary">{org.joinDate}</td>
                    <td className="py-4 px-4 text-sm text-shark-600 font-primary">{org.eventsHosted}</td>
                    <td className="py-4 px-4 text-sm text-shark-600 font-primary">{org.followers}</td>
                    <td className="py-4 px-4 text-sm text-shark-600 font-primary">LKR {org.totalDonations.toLocaleString()}</td>
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
            
            {filteredOrganizations.length === 0 && (
              <div className="text-center py-8 text-shark-500 font-primary">
                No organizations found matching your criteria.
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
