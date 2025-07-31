import HeroSection from '@/components/public/HeroSection';
import Breadcrumb from '@/components/public/Breadcrumb';
import EventSection from '@/components/public/EventSection';

export default function EventsPage() {
  return (
    <div className="flex flex-col justify-center items-start flex-shrink-0">
      <Breadcrumb />
      <HeroSection />
      <EventSection title={'All Events'} subTitle={'Explore our events'} />
    </div>
  );
}
