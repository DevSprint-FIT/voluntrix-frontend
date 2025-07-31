'use client';

import { useRef, useEffect, useState } from 'react';
import EventCard from '@/components/public/EventCard';
import Image from 'next/image';
import { EventType } from '@/types/EventType';
import { fetchAllEvents } from '@/services/publicUserService';
import EventCardSkeleton from '@/components/UI/EventCardSkeleton';
import EventErrorDisplay from '@/components/UI/EventErrorDisplay';

interface EventSectionProps {
  title: string;
  subTitle: string;
}

export default function EventSection({ title, subTitle }: EventSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAllEvents = async () => {
      try {
        const eventsData = await fetchAllEvents();
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching all events:', err);
        setError('Failed to fetch events.');
      } finally {
        setIsLoading(false);
      }
    };

    getAllEvents();
  }, []);

  const checkScroll = () => {
    const { current } = scrollRef;
    if (current) {
      setCanScrollLeft(current.scrollLeft > 0);
      setCanScrollRight(
        current.scrollLeft + current.clientWidth < current.scrollWidth
      );
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 350;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const { current } = scrollRef;
    if (current) {
      current.addEventListener('scroll', checkScroll);
      checkScroll();
    }

    return () => {
      current?.removeEventListener('scroll', checkScroll);
    };
  }, []);

  return (
    <div className="w-full flex items-start justify-center">
      <div className="w-[1248px] relative flex justify-center">
        <div className="w-[1200px] flex flex-col items-start justify-start gap-6">
          <div className="flex flex-col gap-1 justify-start items-start">
            <p className="font-secondary text-shark-950 font-medium text-3xl">
              {title}
            </p>
            <p className="font-secondary text-shark-500 text-lg">{subTitle}</p>
          </div>
          <div
            ref={scrollRef}
            className="w-[1200px] flex overflow-x-auto scroll-smooth whitespace-nowrap no-scrollbar"
          >
            <div className="flex gap-7 mb-12">
              {isLoading ? (
                <div className="flex gap-7">
                  <EventCardSkeleton />
                  <EventCardSkeleton />
                  <EventCardSkeleton />
                  <EventCardSkeleton />
                </div>
              ) : error ? (
                <EventErrorDisplay error={error} />
              ) : (
                events.map((event) => (
                  <EventCard key={event.eventId} event={event} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="rounded-full absolute top-1/2 -translate-y-1/2 left-0 z-10 flex justify-center items-center bg-white w-12 h-12 shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
          >
            <Image
              src="/icons/arrow-black-left.svg"
              width={24}
              height={24}
              alt="Arrow left icon"
            />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="rounded-full absolute top-1/2 -translate-y-1/2 right-0 z-10 flex justify-center items-center bg-white w-12 h-12 shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
          >
            <Image
              src="/icons/arrow-black-right.svg"
              width={24}
              height={24}
              alt="Arrow right icon"
            />
          </button>
        )}
      </div>
    </div>
  );
}
