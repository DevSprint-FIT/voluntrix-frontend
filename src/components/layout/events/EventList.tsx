import EventCard from '@/components/UI/EventCard';
import { EventType } from '@/types/EventType';

type EventListProps = {
  events: EventType[];
  loading: boolean;
  error: string | null;
};

export default function EventList({ events, loading, error }: EventListProps) {
  return (
    <>
      {loading ? (
        console.log('Loading events...')
      ) : error ? (
        console.log('Failed to load events' + error)
      ) : events.length > 0 ? (
        <div className="w-[1054px] flex flex-wrap justify-start gap-x-[62px] gap-y-10 mt-16">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      ) : null}
    </>
  );
}
