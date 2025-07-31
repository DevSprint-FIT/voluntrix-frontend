import EventSection from '@/components/layout/events/EventSection';
import HeroSection from '@/components/layout/events/HeroSection';
import Breadcrumb from '@/components/UI/Breadcrumb';

export default function EventsPage() {
  return (
    <div className="flex flex-col justify-center items-start flex-shrink-0">
      <Breadcrumb />
      <HeroSection />
      <EventSection
        title={'Recommended Events for You'}
        subTitle={
          'Upcoming events tailored to your interests and availability.'
        }
      />
      {/* <EventSection
        title={'Based on your browsing history'}
        subTitle={'Based on searches and preferences'}
      /> */}
    </div>
  );
}
