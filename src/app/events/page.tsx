import EventSection from '@/components/layout/events/EventSection';
import HeroSection from '@/components/layout/events/HeroSection';
import Breadcrumb from '@/components/UI/Breadcrumb';

export default function EventsPage() {
  return (
    <div className="flex flex-col justify-center items-start flex-shrink-0">
      <Breadcrumb />
      <HeroSection />
      <EventSection
        title={'Trending events'}
        subTitle={'Based on your current location, and community engagement'}
      />
      {/* <EventSection
        title={'Based on your browsing history'}
        subTitle={'Based on searches and preferences'}
      /> */}
    </div>
  );
}
