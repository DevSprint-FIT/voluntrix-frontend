"use client";

import EventCard from "../UI/EventCard";
import Image from "next/image";

const eventData = {
  imageUrl: "/images/DummyEvent2.png",
  title: "FIT Future Careers",
  organizer: "INTECS, UoM",
  description: "Join us for an exclusive event focused on connecting aspiring professionals with industry leaders. Discover career opportunities, attend workshops, and network with experts to shape your future.",
  specialTags: ["Private", "Online", "Sponsor"],
  date: "Nov 20, 2025",
  venue: "FIT Auditorium",
  time: "10:00 AM",
  donationAvailable: false,
};

export default function EventSection() {

  return (
    <div className="w-full flex items-start justify-center mt-24">
      <div className="w-[1054px] flex flex-col justify-center text-center">
        <div className="font-primary font-medium text-[2.5rem] text-shark-950">
          Stay Updated with the Latest Events
        </div>
        <div className="font-secondary text-lg text-shark-600 mt-6">
          Discover upcoming opportunities and see what organizations are
          planning. From local clean-ups to global initiatives, stay connected
          and never miss a chance to make an impact.
        </div>
        <div className="mt-16 flex flex-col gap-9">
          <div className="flex gap-[65px]">
            <EventCard event={eventData} />
          </div>
          <div className="flex gap-1 justify-end">
            <p className="text-verdant-600 font-[500]">Explore More Events</p>
            <Image src="/icons/arrow-green.svg" width={24} height={24} alt="arrow-green"/>
          </div>
        </div>
      </div>
    </div>
  );
};