import HeroSection from '@/components/layout/events/HeroSection';
import Breadcrumb from '@/components/UI/Breadcrumb';
import EventSection from '@/components/layout/events/EventSection';

export default function EventsPage() {
  return (
    <div className="flex flex-col justify-center items-start flex-shrink-0">
      <Breadcrumb />
      <HeroSection />
      <EventSection
        title="Discover Events That Fuel Your Passion"
        subTitle="Make a difference by joining events that empower and inspire"
      />
    </div>
  );
}
