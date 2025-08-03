import EventSection from '@/components/layout/events/EventSection';
import HeroSection from '@/components/layout/events/HeroSection';
import FooterSection from '@/components/layout/FooterSection';
import Breadcrumb from '@/components/UI/Breadcrumb';
import GoToTop from '@/components/UI/GoToTop';
import Navbar from '@/components/UI/Navbar';

export default function EventsPage() {
  return (
    <div className="flex flex-col justify-center items-start flex-shrink-0">
      <Navbar />
      <Breadcrumb />
      <HeroSection />
      <EventSection
        title={'Trending events'}
        subTitle={'Based on your current location, and community engagement'}
      />
      <EventSection
        title={'Based on your browsing history'}
        subTitle={'Based on searches and prefernces'}
      />
      <FooterSection />
      <GoToTop />
    </div>
  );
}
