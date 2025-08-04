"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Search, Eye, Edit, Trash2, Calendar, MapPin, Users } from "lucide-react";

// Dummy events data
const dummyEvents = [
  { 
    id: 1, 
    title: "Beach Cleanup Drive", 
    organization: "Green Earth Foundation",
    location: "Colombo Beach",
    date: "2025-08-15",
    time: "08:00 AM",
    volunteers: 25,
    maxVolunteers: 50,
    status: "upcoming",
    category: "Environmental"
  },
  { 
    id: 2, 
    title: "Food Distribution", 
    organization: "Help Foundation",
    location: "Kandy City Center",
    date: "2025-08-12",
    time: "10:00 AM",
    volunteers: 15,
    maxVolunteers: 30,
    status: "ongoing",
    category: "Community Service"
  },
  { 
    id: 3, 
    title: "Tree Planting Campaign", 
    organization: "Green Earth Foundation",
    location: "Peradeniya",
    date: "2025-08-10",
    time: "07:00 AM",
    volunteers: 30,
    maxVolunteers: 40,
    status: "completed",
    category: "Environmental"
  },
  { 
    id: 4, 
    title: "Education Workshop", 
    organization: "Community Care",
    location: "Galle Library",
    date: "2025-08-20",
    time: "02:00 PM",
    volunteers: 12,
    maxVolunteers: 25,
    status: "pending",
    category: "Education"
  },
];

export default function AdminEventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredEvents = dummyEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    const matchesCategory = filterCategory === "all" || event.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-shark-100 text-shark-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Environmental': return 'bg-green-50 text-green-700 border border-green-200';
      case 'Community Service': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Education': return 'bg-purple-50 text-purple-700 border border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-shark-900 font-secondary">Events Management</h1>
        <p className="text-shark-600 font-primary">Manage all events on the platform</p>
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
                placeholder="Search events..."
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
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verdant-500 focus:border-transparent font-primary"
            >
              <option value="all">All Categories</option>
              <option value="Environmental">Environmental</option>
              <option value="Community Service">Community Service</option>
              <option value="Education">Education</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-shark-900 font-secondary">
            Events ({filteredEvents.length})
          </h3>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Event</th>
                  <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Organization</th>
                  <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Date & Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Volunteers</th>
                  <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-shark-700 font-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-shark-900 font-primary">{event.title}</div>
                          <div className="text-sm text-shark-600 font-primary flex items-center gap-1">
                            <MapPin size={12} />
                            {event.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-shark-600 font-primary">{event.organization}</td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-shark-900 font-primary">{event.date}</div>
                      <div className="text-xs text-shark-600 font-primary">{event.time}</div>
                    </td>
                    <td className="py-4 px-4 text-sm text-shark-600 font-primary">{event.location}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-sm text-shark-600 font-primary">
                        <Users size={16} />
                        {event.volunteers}/{event.maxVolunteers}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
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
            
            {filteredEvents.length === 0 && (
              <div className="text-center py-8 text-shark-500 font-primary">
                No events found matching your criteria.
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
