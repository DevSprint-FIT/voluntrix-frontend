"use client";

import React, { useState } from "react";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  Search,
  Filter,
  Clock,
  Calendar,
} from "lucide-react";

// Mock document data
interface EventDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  category: "Contract" | "Report" | "Promotional" | "Legal" | "Misc";
}

const DocumentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<EventDocument | null>(null);

  // Mock data for documents
  const documentsData: EventDocument[] = [
    {
      id: "1",
      name: "Volunteer Agreement Form.pdf",
      type: "PDF",
      size: "245 KB",
      uploadedBy: "Sarah Johnson",
      uploadDate: "2025-07-15",
      category: "Legal",
    },
    {
      id: "2",
      name: "Event Budget Breakdown.xlsx",
      type: "XLSX",
      size: "128 KB",
      uploadedBy: "Michael Chen",
      uploadDate: "2025-07-18",
      category: "Report",
    },
    {
      id: "3",
      name: "Venue Rental Contract.pdf",
      type: "PDF",
      size: "356 KB",
      uploadedBy: "Sarah Johnson",
      uploadDate: "2025-07-10",
      category: "Contract",
    },
    {
      id: "4",
      name: "Sponsorship Agreement.docx",
      type: "DOCX",
      size: "184 KB",
      uploadedBy: "David Wilson",
      uploadDate: "2025-07-20",
      category: "Contract",
    },
    {
      id: "5",
      name: "Event Poster Design.png",
      type: "PNG",
      size: "1.2 MB",
      uploadedBy: "Emma Rodriguez",
      uploadDate: "2025-07-12",
      category: "Promotional",
    },
    {
      id: "6",
      name: "Safety Guidelines.pdf",
      type: "PDF",
      size: "198 KB",
      uploadedBy: "Lisa Thompson",
      uploadDate: "2025-07-08",
      category: "Legal",
    },
    {
      id: "7",
      name: "Post-Event Report.docx",
      type: "DOCX",
      size: "215 KB",
      uploadedBy: "James Anderson",
      uploadDate: "2025-07-22",
      category: "Report",
    },
  ];

  // Filter documents based on search query and category
  const filteredDocuments = documentsData.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = [
    "All",
    ...new Set(documentsData.map((doc) => doc.category)),
  ];

  // Function to get file icon based on type
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-500" />;
      case "docx":
      case "doc":
        return <FileText className="h-6 w-6 text-blue-600" />;
      case "xlsx":
      case "xls":
        return <FileText className="h-6 w-6 text-green-600" />;
      case "png":
      case "jpg":
      case "jpeg":
        return <FileText className="h-6 w-6 text-purple-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <div className="bg-white mb-6 mt-2">
        <div className="px-6 py-8">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-verdant-600" />
            <h1 className="text-3xl font-bold text-shark-950 font-secondary">
              Event Documents
            </h1>
          </div>
        </div>
      </div>

      {/* Document Statistics */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            style={{ backgroundColor: "#FBFBFB" }}
            className="rounded-xl p-6 min-w-0 w-full flex items-center gap-4 md:gap-6"
          >
            <div className="bg-verdant-50 rounded-full p-3 flex-shrink-0">
              <FileText size={28} className="text-verdant-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-secondary text-shark-950 font-medium text-lg">
                Total Documents
              </h3>
              <div className="text-3xl font-bold text-verdant-600">
                {documentsData.length}
              </div>
              <p className="text-sm text-gray-500">All event documents</p>
            </div>
          </div>

          <div
            style={{ backgroundColor: "#FBFBFB" }}
            className="rounded-xl p-6 min-w-0 w-full flex items-center gap-4 md:gap-6"
          >
            <div className="bg-verdant-50 rounded-full p-3 flex-shrink-0">
              <Clock size={28} className="text-verdant-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-secondary text-shark-950 font-medium text-lg">
                Recent Uploads
              </h3>
              <div className="text-3xl font-bold text-verdant-600">
                {
                  documentsData.filter(
                    (doc) =>
                      new Date(doc.uploadDate) >
                      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length
                }
              </div>
              <p className="text-sm text-gray-500">Last 7 days</p>
            </div>
          </div>

          <div
            style={{ backgroundColor: "#FBFBFB" }}
            className="rounded-xl p-6 min-w-0 w-full flex items-center gap-4 md:gap-6"
          >
            <div className="bg-verdant-50 rounded-full p-3 flex-shrink-0">
              <Calendar size={28} className="text-verdant-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-secondary text-shark-950 font-medium text-lg">
                Legal Documents
              </h3>
              <div className="text-3xl font-bold text-verdant-600">
                {documentsData.filter((doc) => doc.category === "Legal").length}
              </div>
              <p className="text-sm text-gray-500">Contracts & agreements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="px-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 pl-10 py-2 text-sm focus:border-verdant-500 focus:ring-verdant-500 bg-white border"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                className="rounded-md border-gray-300 py-2 text-sm focus:border-verdant-500 focus:ring-verdant-500 bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-verdant-600 hover:bg-verdant-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verdant-500"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </button>
          </div>
        </div>
      </div>

      {/* Documents table */}
      <div className="px-6">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Size
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Uploaded By
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getFileIcon(document.type)}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-shark-950">
                            {document.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {document.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-verdant-100 text-verdant-800">
                        {document.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {document.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-shark-950">
                        {document.uploadedBy}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(document.uploadDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          className="text-verdant-600 hover:text-verdant-900"
                          title="Preview"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          className="text-verdant-600 hover:text-verdant-900"
                          title="Download"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No documents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal Placeholder */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-shark-950 mb-4">
              Upload Document
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop files here, or click to select files
              </p>
              <input type="file" className="hidden" id="file-upload" />
              <label
                htmlFor="file-upload"
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-verdant-600 hover:bg-verdant-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verdant-500 cursor-pointer"
              >
                Select File
              </label>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="mr-2 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verdant-500"
              >
                Cancel
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-verdant-600 hover:bg-verdant-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verdant-500">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
