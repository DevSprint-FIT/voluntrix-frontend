import EventSection from "@/components/layout/EventSection";
import ServiceSection from "@/components/layout/ServiceSection";
import VolunteerSection from "@/components/layout/VolunteerSection";
import FooterSection from "@/components/layout/FooterSection";

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-start flex-shrink-0 gap-[200px]">
      <ServiceSection />
      <EventSection />
      <VolunteerSection />
      <FooterSection />
    </div>
  );
}
