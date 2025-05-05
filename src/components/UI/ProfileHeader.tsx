"use client";

import { CheckCircle, MapPin, Calendar } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ProfileHeaderProps {
  data: {
    name?: string;
    username?: string;
    institute?: string;
    isVerified?: boolean;
    followerCount?: number;
    joinedDate?: number[]; 
    imageUrl?: string;
  };
}

const ProfileHeader: React.FC<{ data: ProfileHeaderProps["data"] }> = ({ data }) => {
  // Function to convert joinedDate array to a valid Date
  const formatJoinedDate = (joinedDate: number[]) => {
    if (Array.isArray(joinedDate) && joinedDate.length >= 7) {
      const [year, month, day, hour, minute, second] = joinedDate;
      // Construct a date from the array 
      const date = new Date(year, month - 1, day, hour, minute, second);
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    }
    return "Unknown";
  };

  return (
    <div className="flex items-start p-6 bg-shark-50 rounded-2xl shadow-sm gap-6 mb-6">
      {/* Profile Image */}
      <div className="w-24 h-24 flex items-center justify-center overflow-hidden rounded-2xl bg-white">
        {data?.imageUrl ? (
          <Image
            src={data.imageUrl}
            alt="Profile Image"
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="text-2xl font-bold text-shark-400">
            {data?.name ? data.name[0] : "?"}
          </div>
        )}
      </div>

      {/* Profile Details */}
      <div className="flex flex-col justify-between h-full">
        {/* Username */}
        <h2 className="text-lg font-semibold">{data?.username ? `@${data.username}` : "@UnknownUsername"}</h2>

        {/* Name */}
        <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">{data?.name || "Unknown Name"}</h1>
        {data?.isVerified && <CheckCircle className="w-5 h-5 text-verdant-500" />}
        </div>
        

        {/* Location and Joined Date  */}
        <div className="flex items-center gap-6 text-shark-500 text-sm mt-2">
          {/* Location */}
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{data?.institute || "Unknown Institute"}</span>
          </div>

          {/* Joined Date */}
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              Joined{" "}
              {data?.joinedDate
                ? formatJoinedDate(data.joinedDate) 
                : "Unknown"}
            </span>
          </div>
        </div>

        {/* Follower Count */}
        <p className="mt-4 font-semibold text-shark-800">{data?.followerCount || 0} Followers</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
