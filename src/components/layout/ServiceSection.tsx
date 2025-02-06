"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    },
    {
      imageUrl: "/images/service-3.png",
      header: "Sponsorships made seamless.",
      paragraph:
        "Connect with sponsors seamlessly to support your needs. Manage sponsorship requests and payments with ease while maintaining transparency and trust.",
      end: "Learn more",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [services.length]);

  return (
    <div className="relative w-full bg-white flex justify-center py-10">
      <div className="w-[1200px] text-center">
        <h2 className="text-[2.5rem] font-primary font-medium text-shark-900 mb-12" style={{"lineHeight": "3rem"}}>
          Streamline Your Volunteering <br /> Experience Today
        </h2>
        <div className="relative h-[350px] flex justify-center items-center mt-24 mb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
              className="absolute"
            >
              <ServiceCard {...services[currentIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-3 mx-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-8 bg-black" : "w-3 bg-gray-400"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}
