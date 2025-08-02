"use client";

import React, { useState, useEffect } from "react";
import {
  volunteerProfileService,
  VolunteerProfile,
} from "@/services/volunteerProfileService";

const ProfileIndicator: React.FC = () => {
  const [profile, setProfile] = useState<VolunteerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const profileData = await volunteerProfileService.getVolunteerProfile();
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch volunteer profile:", error);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="animate-pulse">
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
        </div>
        <div className="animate-pulse flex flex-col space-y-1">
          <div className="h-4 bg-gray-200 rounded w-28"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return null; // Don't show anything if there's an error
  }

  return (
    <div className="flex items-center space-x-4 mr-4">
      <img
        src={profile.profilePictureUrl || "/images/default-profile.jpg"}
        alt={profile.fullName}
        className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
      />
      <div className="flex flex-col">
        <p className="text-base font-medium font-secondary font-semibold text-shark-950">
          {profile.fullName}
        </p>
        <p className="text-sm text-shark-500 font-secondary">
          @{profile.username}
        </p>
      </div>
    </div>
  );
};

export default ProfileIndicator;
