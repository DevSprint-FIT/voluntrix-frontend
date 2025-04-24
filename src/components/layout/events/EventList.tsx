import EventCard from '@/components/UI/EventCard';

const eventData = {
  imageUrl: '/images/DummyEvent2.png',
  title: 'FIT Future Careers',
  organizer: 'INTECS, UoM',
  description:
    'Join us for an exclusive event focused on connecting aspiring professionals with industry leaders. Discover career opportunities, attend workshops, and network with experts to shape your future.',
  specialTags: ['Private', 'Online', 'Sponsor'],
  date: 'Nov 20, 2025',
  venue: 'FIT Auditorium',
  time: '10:00 AM',
  donationAvailable: false,
};

export default function EventList() {
  return (
    <div className="w-[1054px] flex flex-wrap justify-start gap-x-[62px] gap-y-10 mt-16">
      <EventCard event={eventData} />
      <EventCard event={eventData} />
      <EventCard event={eventData} />
      <EventCard event={eventData} />
    </div>
  );
}
