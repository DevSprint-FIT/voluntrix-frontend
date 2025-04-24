'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Progress } from '@heroui/progress';
import { Button } from '@heroui/button';

// need to fetch this type of structured data to build cards
interface Event {
  imageUrl: string;
  title: string;
  organizer: string;
  description: string;
  specialTags: string[];
  date: string;
  venue: string;
  time?: string;
  donationAvailable: boolean;
}

export default function EventCard({ event }: { event: Event }) {
  const [isSaved, setIsSaved] = useState(false);
  const [value] = useState(50);

  const handleSave = () => {
    setIsSaved((prevState) => !prevState);
  };

  return (
    <div className="w-[310px] h-[460px] group rounded-[10px] bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 font-secondary overflow-hidden">
      {event && (
        <>
          <div className="h-[165px] relative overflow-hidden">
            <Image
              src={event.imageUrl || '/images/DummyEvent2.png'}
              className="rounded-t-[10px] transition-all duration-500 group-hover:scale-110 group-hover:brightness-50"
              width={310}
              height={165}
              alt={event.title}
            />
            <Button className="w-[92px] h-[36px] rounded-[5px] border-white border-[0.5px] bg-transparent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-secondary text-center text-[12px] font-[500] text-shark-50 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
              View Event
            </Button>
          </div>
          <div className="flex justify-center w-[308px] mt-[17px]">
            <div className="w-[258px]">
              <div className="flex flex-col items-start gap-4">
                <div className="flex w-full items-start">
                  <p className="w-[234px] text-shark-950 font-bold text-xl text-left text-wrap">
                    {event.title}
                  </p>
                  <button onClick={handleSave}>
                    <Image
                      src={
                        isSaved ? '/icons/tick-circle.svg' : '/icons/save.svg'
                      }
                      width={24}
                      height={24}
                      alt="save"
                    />
                  </button>
                </div>
                <p
                  className="text-shark-900 font-medium text-md text-wrap"
                  style={{ marginTop: '-10px' }}
                >
                  By {event.organizer}
                </p>
                {!event.donationAvailable && (
                  <p className="text-shark-900 text-[13px] font-normal text-left text-wrap">
                    {event.description}
                  </p>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  {event.specialTags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex h-[22px] px-2 justify-center items-center rounded-[4px] bg-[#E7E7E7]"
                    >
                      <p className="text-[12px] font-primary font-bold text-shark-600">
                        {tag}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-8">
                  <div className="flex gap-2 items-start">
                    <Image
                      src="/icons/calendar.svg"
                      width={20}
                      height={20}
                      alt="calendar"
                    />
                    <p className="font-secondary text-shark-900 text-[12px] font-bold text-left">
                      {event.date} <br />
                      {event.time && `at ${event.time}`}
                    </p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <Image
                      src="/icons/location.svg"
                      width={20}
                      height={20}
                      alt="location"
                    />
                    <p className="w-24 text-left font-secondary text-shark-900 text-[12px] font-bold text-wrap">
                      {event.venue}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {event.donationAvailable && (
            <div className="flex justify-center w-[308px] mt-[20px]">
              <div className="w-[258px] flex gap-1 justify-center items-center flex-col">
                <Progress
                  aria-label="Downloading..."
                  className="w-[249px]"
                  color="success"
                  showValueLabel={false}
                  size="md"
                  value={value}
                />
                <div className="flex gap-1 justify-between w-full px-[4px] text-[12px] text-secondary ">
                  <div className="text-verdant-600">
                    <span>{100 - value}%</span> to complete
                  </div>
                  <div className="text-shark-500">
                    Goal $<span>20,000</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
