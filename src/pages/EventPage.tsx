import FooterSection from '@/components/layout/FooterSection';
import GoToTop from '@/components/UI/GoToTop';
import Navbar from '@/components/UI/Navbar';
import Event from '@/components/layout/events/Event';

const eventData = {
  imageUrl: '/images/DummyEvent2.png',
  title: 'FIT Future Careers',
  organizer: 'INTECS, UoM',
  description:
    'Body text for your whole article or post. We’ll put in some lorem ipsum to show how a filled-out page might look: .Excepteur efficient emerging, minim veniam anim aute carefully curated Ginza conversation exquisite perfect nostrud nisi intricate Content. Qui  international first-class nulla ut. Punctual adipisicing, essential lovely queen tempor eiusmod irure. ',
  specialTags: ['Private', 'Online', 'Sponsor'],
  date: 'Nov 20, 2025',
  venue: 'FIT Auditorium',
  time: '10:00 AM',
  donationAvailable: true,
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
      <FooterSection />
      <GoToTop />
    </div>
  );
}
