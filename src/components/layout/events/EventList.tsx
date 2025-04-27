import EventCard from '@/components/UI/EventCard';
import EventCardSkeleton from '@/components/UI/EventCardSkeleton';
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
        <div className="w-[1054px] flex justify-start gap-[62px] mt-16">
          {[...Array(3)].map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
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
