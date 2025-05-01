"use client";

import React from "react";

interface AboutSectionProps {
    description: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ description}) => {
    return (
        <div className="bg-shark-50 p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p className="text-gray-700">{description}</p>
    </div>
    )
}

export default AboutSection;