"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Mail, Phone, Building2, Briefcase, Globe } from "lucide-react";
import Image from "next/image";

interface SponsorProfile {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  website?: string;
  profilePictureUrl?: string;
  about: string;
  institute: string;
  company: string;
  jobTitle: string;
  joinedDate: string;
}


const mockSponsorProfile: SponsorProfile = {
  id: 1,
  username: "john_doe_sponsor",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@company.com",
  phoneNumber: "+1 (555) 123-4567",
  website: "https://www.techsolutions.com",
    profilePictureUrl: "/images/default-profile.jpg",
  about: "I'm passionate about supporting educational initiatives and community development projects. With over 10 years of experience in the corporate sector, I believe in giving back to society by sponsoring meaningful volunteer programs that create lasting impact in our communities.",
  institute: "Stanford University",
  company: "Tech Solutions Inc.",
  jobTitle: "Senior Product Manager",
  joinedDate: "2023-08-15T00:00:00Z"
};


const formatJoinedDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });
};

const SponsorProfilePage = () => {
  const [profile, setProfile] = useState<SponsorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        
        setProfile(mockSponsorProfile);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#029972] mx-auto mb-4"></div>
          <p className="text-gray-600 font-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-secondary mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white font-secondary rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600 font-secondary">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left Side: Title */}
          <div>
            <nav className="text-[#B0B0B0] font-secondary mb-2 mt-3">
              Sponsor / Profile
            </nav>
            <h1 className="text-2xl font-bold font-secondary text-gray-900">
              Profile
            </h1>
          </div>

          {/* Right Side: Sponsor Info */}
          {profile && (
            <div className="flex items-center gap-3">
              <Image
                src={profile.profilePictureUrl || "/api/placeholder/40/40"}
                alt="Sponsor Profile"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold font-secondary text-xl leading-tight">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="font-secondary font-semibold text-[#4F4F4F] text-xs leading-tight">
                  {profile.company}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Main Profile Card */}
          <div className="bg-[#FBFBFB] rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-10">
              <Image
                src={profile.profilePictureUrl || "/api/placeholder/120/120"}
                alt={profile.firstName}
                width={120}
                height={120}
                className="rounded-lg object-cover"
              />

              <div className="flex-1">
                <div className="flex flex-col mb-2">
                  <span className="text-gray-500 font-secondary mb-0">
                    @{profile.username}
                  </span>
                  <h2 className="text-2xl font-bold font-secondary text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h2>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center text-gray-600 font-secondary">
                    <Building2 size={16} className="mr-1" />
                    <span>{profile.company}</span>
                  </div>
                  <div className="flex items-center text-gray-600 font-secondary">
                    <Briefcase size={16} className="mr-1" />
                    <span>{profile.jobTitle}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center text-gray-600 font-secondary">
                    <MapPin size={16} className="mr-1" />
                    <span>{profile.institute}</span>
                  </div>
                  <div className="flex items-center text-gray-600 font-secondary">
                    <Calendar size={16} className="mr-1" />
                    <span>
                      Joined {formatJoinedDate(profile.joinedDate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-6 mb-4">
                  <div className="flex items-center space-x-2">
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Section - Full Width */}
          <div className="bg-[#FBFBFB] rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold font-secondary text-gray-900 mb-4">
              About
            </h3>
            <p className="text-gray-600 font-secondary leading-relaxed">
              {profile.about}
            </p>
          </div>

          {/* Contact Information - Half Width */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#FBFBFB] rounded-lg p-6">
              <h3 className="text-lg font-semibold font-secondary text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 font-secondary">
                      Email
                    </p>
                    <p className="font-medium text-gray-900 font-secondary">
                      {profile.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 font-secondary">
                      Phone
                    </p>
                    <p className="font-medium text-gray-900 font-secondary">
                      {profile.phoneNumber}
                    </p>
                  </div>
                </div>
                {profile.website && (
                  <div className="flex items-center space-x-3">
                    <Globe size={16} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 font-secondary">
                        Website
                      </p>
                      <a 
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 font-secondary hover:text-blue-800 transition-colors"
                      >
                        {profile.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorProfilePage;