import EventSection from "@/components/layout/EventSection";
import ServiceSection from "@/components/layout/ServiceSection";
import FeedSection from "@/components/layout/FeedSection";
import FooterSection from "@/components/layout/FooterSection";
import Navbar from "@/components/UI/Navbar";
import HeroSection from "@/components/layout/HeroSection";

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-start flex-shrink-0 gap-[100px]">
      <Navbar />
      <HeroSection />
      <ServiceSection />
      <EventSection />
      <FeedSection />
      <FooterSection />
    </div>
  );
}
