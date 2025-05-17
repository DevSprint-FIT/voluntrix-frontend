"use client";

import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

interface SocialLinksProps {
  data?: {
    facebookLink?: string;
    instagramLink?: string;
    linkedinLink?: string;
  };
}

const SocialLinks: React.FC<SocialLinksProps> = ({ data }) => {
  const renderLink = (link?: string) => {
    if (data === undefined) {
      // Still loading
      return <div className="w-32 h-4 bg-shark-100 rounded" />;
    }

    if (link) {
      return (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:underline break-all"
        >
          {link}
        </a>
      );
    }

    // Data loaded but link is missing
    return <span className="text-shark-400">-</span>;
  };

  return (
    <div className="bg-[#FBFBFB] p-6 rounded-lg shadow-sm w-full md:w-[545px] mt-7">
      <h2 className="text-xl font-semibold mb-4">Social Links</h2>

      <div className="flex flex-col gap-4 text-shark-900">
        {/* Facebook */}
        <div className="flex items-center gap-2">
          <FaFacebook className="text-[#0866FF] text-3xl" />
          <div>{renderLink(data?.facebookLink)}</div>
        </div>

        {/* Instagram */}
        <div className="flex items-center gap-2">
          <FaInstagram className="text-[#E1306C] text-3xl" />
          <div>{renderLink(data?.instagramLink)}</div>
        </div>

        {/* LinkedIn */}
        <div className="flex items-center gap-2">
          <FaLinkedin className="text-[#0A66C2] text-3xl" />
          <div>{renderLink(data?.linkedinLink)}</div>
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
