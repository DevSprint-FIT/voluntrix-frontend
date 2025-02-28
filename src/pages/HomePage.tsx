import EventSection from "@/components/layout/EventSection";
import ServiceSection from "@/components/layout/ServiceSection";
import FeedSection from "@/components/layout/FeedSection";
import FooterSection from "@/components/layout/FooterSection";
import Navbar from "@/components/UI/Navbar";
import HeroSection from "@/components/layout/HeroSection";
import TestimonialSection from "@/components/layout/TestimonialSection";

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center aitems-start flex-shrink-0 gap-[50px]">
      <Navbar />
      <HeroSection />
      <ServiceSection />
      <EventSection />
      <FeedSection />
      <TestimonialSection />
      <hr className="w-[1250px] border-t border-shark-200 mx-auto" />
      <FooterSection />
    </div>
  );
}
