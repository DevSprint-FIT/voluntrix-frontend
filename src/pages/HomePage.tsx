import EventSection from "@/components/layout/EventSection";
import ServiceSection from "@/components/layout/ServiceSection";

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-start flex-shrink-0 gap-[200px]">
      <ServiceSection />
      <EventSection />
    </div>
  );
}
