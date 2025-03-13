import EventSection from "@/components/layout/events/EventSection";
import HeroSection from "@/components/layout/events/HeroSection";
import FooterSection from "@/components/layout/FooterSection";
import GoToTop from "@/components/UI/GoToTop";
import Navbar from "@/components/UI/Navbar";

export default function EventsPage() {
  return (
    <div className="flex flex-col justify-center items-start flex-shrink-0">
      <Navbar />
      <HeroSection />
      <EventSection />
      <FooterSection />
      <GoToTop />
    </div>
  );
}
