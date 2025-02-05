import EventCard from "./EventCard";
import Image from "next/image";

const EventSection = () => {
  return (
    <div className="w-full flex items-start justify-center">
      <div className="w-[1054px] flex flex-col justify-center text-center">
        <div className="text-primary font-medium text-4xl text-shark-950">
          Stay Updated with the Latest Events
        </div>
        <div className="text-secondary text-lg text-shark-600 mt-6">
          Discover upcoming opportunities and see what organizations are
          planning. From local clean-ups to global initiatives, stay connected
          and never miss a chance to make an impact.
        </div>
        <div className="mt-16 flex flex-col gap-9">
          <div className="flex gap-[65px]">
            <EventCard />
            <EventCard />
            <EventCard />
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

export default EventSection;
