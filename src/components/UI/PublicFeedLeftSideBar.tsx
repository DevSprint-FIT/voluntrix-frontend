import React from "react";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";

interface ProfileCardProps {
  profileImageUrl?: string; 
  name: string;
  institute: string;
  about: string; 
  isVerified?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profileImageUrl, name, institute, about, isVerified }) => {
  return (
    <div className="bg-[#FBFBFB] shadow-sm rounded-2xl p-6 w-full max-w-sm text-center  ml-10 mt-1">
      <div className="flex flex-col items-center space-y-4">
        <Image
          src={profileImageUrl || "/images/default-profile.jpg"}
          alt="Profile"
          className="rounded-full object-cover border-shark-200"
          width={112}
          height={112}
        />
        <div className="flex items-center justify-center gap-1">
          <h2 className="text-2xl font-secondary font-semibold">
          {name}
          </h2>
           {isVerified && <BadgeCheck className="text-verdant-500  w-5 h-5" />}
        
        </div>
        
        <p className=" font-secondary font-semibold text-medium text-shark-900">{institute}</p>
        <p className="text-sm text-shark-800 mt-2 line-clamp-5">{about}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
