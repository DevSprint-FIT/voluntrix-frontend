"use client";

import React from "react";
import { Globe, Camera, Briefcase } from "lucide-react";

interface SocialLinksProps {
  data?: {
    facebookLink?: string;
    instagramLink?: string;
    linkedinLink?: string;
  };
}

const SocialLinks: React.FC<SocialLinksProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-shark-50 p-6 rounded-lg shadow mt-7 w-full md:w-[545px]">
      <div className="mb-4">
        <h2 className="font-secondary text-xl font-medium">Social Links</h2>
      </div>

      <div className="flex flex-col gap-4 text-shark-900">
        <div className="flex items-center gap-2">
          <Globe className="text-[#0866FF]" />
          {data.facebookLink ? (
            <a
              href={data.facebookLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:underline break-all"
            >
              {data.facebookLink}
            </a>
          ) : (
            <span className="text-shark-400">-</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Camera className="text-[#E1306C]" />
          {data.instagramLink ? (
            <a
              href={data.instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:underline break-all"
            >
              {data.instagramLink}
            </a>
          ) : (
            <span className="text-shark-400">-</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="text-[#0A66C2]" />
          {data.linkedinLink ? (
            <a
              href={data.linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:underline break-all"
            >
              {data.linkedinLink}
            </a>
          ) : (
            <span className="text-shark-400">-</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
