'use client';

import { useRef, useEffect, useState } from 'react';
import EventCard from '@/components/UI/EventCard';
import Image from 'next/image';

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

interface EventSectionProps {
  title: string;
  subTitle: string;
}

export default function EventSection({ title, subTitle }: EventSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
      const scrollAmount = 450;
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
    <div className="w-full flex items-start justify-center mb-12">
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
            <div className="flex gap-7">
              <EventCard event={eventData} />
              <EventCard event={eventData} />
              <EventCard event={eventData} />
              <EventCard event={eventData} />
              <EventCard event={eventData} />
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
