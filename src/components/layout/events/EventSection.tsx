import EventCard from "@/components/UI/EventCard";

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
    <div className="w-full flex items-start justify-center mt-[88px]">
      <div className="w-[1200px] flex flex-col items-start justify-start gap-6 overflow-hidden">
        <div className="flex flex-col gap-1 justify-start items-start">
            <p className="font-secondary text-shark-950 font-medium text-3xl">Trending Events</p>
            <p className="font-secondary text-shark-500 text-lg">Based on your current location, and community engagement</p>
        </div>
        <div className="flex gap-7">
            <EventCard event={eventData}/>
        </div>
      </div>
    </div>
  );
}
