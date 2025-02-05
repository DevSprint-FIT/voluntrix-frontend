"use client";

import { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";

export default function ServiceSection() {
    const services = [
        {
          imageUrl: "/images/service-1.png",
          header: "Effortless event organization.",
          paragraph:
            "Effortlessly organize and manage events with our all-in-one platform. From event creation to volunteer assignment and task tracking, streamline every step to ensure success.",
          end: "Learn more",
        },
        {
            imageUrl: "/images/service-2.png",
            header: "Volunteer engagement simplified.",
            paragraph:
              "Track and manage your volunteers effectively. Gain insights into participation, performance, and contributions to foster stronger engagement.",
            end: "Learn more",
          }
          
      ];
      
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, [services.length]);

  return (
    <div className="relative w-full bg-white flex justify-center py-10">
      
      <div className="w-[1200px] text-center">
        <h2 className="text-3xl font-secondary-300 text-gray-800 mb-12">
          Streamline Your Volunteering <br /> Experience Today
        </h2>

        
        <div className="relative">
          <ServiceCard {...services[currentIndex]} />
        </div>
      </div>
    </div>
  );
}
