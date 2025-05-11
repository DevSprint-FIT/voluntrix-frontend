"use client";

import React from "react";

interface AboutSectionProps {
  description?: string; // Made it optional to handle loading state
}

const AboutSection: React.FC<AboutSectionProps> = ({ description }) => {
  return (
    <div className="bg-[#FBFBFB] p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-2">About</h2>
      <div className="text-shark-900">
        {description || <div className="w-72 h-4 bg-shark-100 rounded"></div>}
      </div>
    </div>
  );
};

export default AboutSection;
