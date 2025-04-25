import FooterSection from '@/components/layout/FooterSection';
import GoToTop from '@/components/UI/GoToTop';
import Navbar from '@/components/UI/Navbar';
import Event from '@/components/layout/events/Event';
import EventSection from '@/components/layout/events/EventSection';
import { EventType } from '@/types/EventType';

const eventData: EventType = {
  eventTitle: 'FIT Future Careers',
  eventDescription:
    'Body text for your whole article or post. We’ll put in some lorem ipsum to show how a filled-out page might look: .Excepteur efficient emerging, minim veniam anim aute carefully curated Ginza conversation exquisite perfect nostrud nisi intricate Content. Qui  international first-class nulla ut. Punctual adipisicing, essential lovely queen tempor eiusmod irure. ',
  eventLocation: 'FIT Auditorium',
  eventDate: '2025-11-20',
  eventTime: '10:00:00',
  eventImageUrl: '/images/DummyEvent2.png',
  eventType: 'ONLINE',
  eventVisibility: 'PRIVATE',
  eventStatus: 'PENDING',
  sponsorshipEnabled: true,
  donationEnabled: true,
  categories: [
    { categoryId: 1, categoryName: 'environment' },
    { categoryId: 3, categoryName: 'technology' },
  ],
  organizer: 'INTECS, UoM',
};

const sponsorData = {
  sponsorships: [
    'Title Partner',
    'Platinum Partner',
    'Gold Partner',
    'Silver Partner',
  ],
};

export default function EventPage() {
  return (
    <div className="flex flex-col justify-center items-start flex-shrink-0">
      <Navbar />
      <Event event={eventData} sponsor={sponsorData} />
      <EventSection
        title={'Based on your browsing history'}
        subTitle={'Based on searches and prefernces'}
      />
      <FooterSection />
      <GoToTop />
    </div>
  );
}
