'use client';

import { Button, Progress } from '@heroui/react';
import Image from 'next/image';
import { useState } from 'react';
import { EventType } from '@/types/EventType';

interface Sponsor {
  sponsorships: string[];
}

export default function Event({
  event,
  sponsor,
}: {
  event: EventType;
  sponsor: Sponsor;
}) {
  const [isSaved, setIsSaved] = useState(false);
  const [value] = useState(40);

  const handleSave = () => {
    setIsSaved((prevState) => !prevState);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date); // Output: "Nov 20, 2025"
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date); // Output: "10:00 AM"
  };

  return (
    <div className="w-full flex items-start justify-center mb-[88px]">
      <div className="w-[1200px] flex flex-col items-center justify-start">
        <div className="mt-14 flex gap-20">
          <div className="w-[522px] flex items-center justify-end">
            <Image
              src={'/images/DummyEvent2.png'}
              width={495}
              height={369}
              alt="event image"
            />
          </div>
          <div className="flex justify-start w-[545px]">
            <div className="flex flex-col items-start gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex w-full items-start">
                  <p className="w-[513px] font-secondary text-shark-950 font-medium text-4xl text-left text-wrap">
                    {event.eventTitle}
                  </p>
                  <button onClick={handleSave}>
                    <Image
                      src={
                        isSaved ? '/icons/tick-circle.svg' : '/icons/save.svg'
                      }
                      width={32}
                      height={32}
                      alt="save"
                    />
                  </button>
                </div>
                <div className="flex gap-2 items-center">
                  <Image
                    src={'/images/DummyOrganization.svg'}
                    className="rounded-full"
                    width={40}
                    height={40}
                    alt="organiztion"
                  />
                  <p className="text-shark-800 font-medium text-2xl text-wrap">
                    By {event.organizer}
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex gap-2 items-center">
                  <Image
                    src="/icons/calendar.svg"
                    width={32}
                    height={32}
                    alt="calendar"
                  />
                  <p className="font-secondary text-shark-950 text-[16px] font-medium text-left">
                    {formatDate(event.eventStartDate)}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <Image
                    src="/icons/clock.svg"
                    width={32}
                    height={32}
                    alt="clock"
                  />
                  <p className="font-secondary text-shark-950 text-[16px] font-medium text-left">
                    {event.eventTime && `${formatTime(event.eventTime)}`}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <Image
                    src="/icons/location.svg"
                    width={32}
                    height={32}
                    alt="location"
                  />
                  <p className="w-[200px] text-left font-secondary text-shark-950 text-[16px] font-medium text-wrap">
                    {event.eventLocation}
                  </p>
                </div>
              </div>
              {(() => {
                const sentences = event.eventDescription.match(
                  /[^.!?]+[.!?]+/g
                ) || [event.eventDescription];
                const firstParagraph = sentences.slice(0, 2).join(' ');
                const secondParagraph = sentences.slice(2).join(' ');

                return (
                  <div className="flex flex-col gap-5">
                    <p className="text-shark-950 text-[16px] font-normal text-left text-wrap">
                      {firstParagraph}
                    </p>
                    {secondParagraph && (
                      <p className="text-shark-950 text-[16px] font-normal text-left text-wrap">
                        {secondParagraph}
                      </p>
                    )}
                  </div>
                );
              })()}
              <Button
                variant="shadow"
                className="bg-shark-950 text-white text-sm font-primary px-4 py-2 rounded-[20px] tracking-[1px]"
              >
                Volunteer Now
              </Button>
            </div>
          </div>
        </div>
        <div className="w-[1150px] flex gap-10 mt-20 justify-start">
          <div className="w-[719px] flex flex-col gap-7 justify-start">
            <p className="text-4xl font-secondary font-medium text-shark-950">
              Spornsorships
            </p>
            <p className="w-[690px] text-shark-950 text-[16px] font-normal text-left text-wrap">
              Excepteur efficient emerging, minim veniam anim aute carefully
              curated Ginza conversation exquisite perfect nostrud nisi
              intricate Content. Qui international first-class nulla ut.
              Punctual adipisicing, essential lovely queen tempor eiusmod irure.
              Excepteur...
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {sponsor.sponsorships.map((tag, index) => (
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
            <Button
              variant="ghost"
              color="default"
              className="w-[272px] h-[79px] flex items-center justify-center gap-3 rounded-[20px] border border-shark-600 bg-white"
            >
              <Image
                src={'/icons/document.svg'}
                width={40}
                height={40}
                alt="document"
              />
              <div className="felx flex-col">
                <p className="font-medium text-shark-950 text-md">
                  Sponsorship-proposal
                </p>
                <p className="font-normal text-shark-500 text-sm">
                  0.17 MB PDF file
                </p>
              </div>
            </Button>
            <Button
              variant="shadow"
              className="w-[160px] bg-shark-950 text-white text-sm font-primary px-4 py-2 rounded-[20px] tracking-[1px]"
            >
              Sponsor Now
            </Button>
          </div>
          {event.donationEnabled && (
            <div className="w-[400px] flex flex-col gap-7 justify-start">
              <p className="text-4xl font-secondary font-medium text-shark-950">
                Donations
              </p>
              <p className="text-shark-950 text-[16px] font-normal text-left text-wrap">
                Excepteur efficient emerging, minim veniam anim aute carefully
                curated Ginza conversation exquisite perfect nostrud nisi
                intricate Content. Qui international first-class nulla ut.
                Punctual adipisicing, essential lovely queen tempor eiusmod
                irure. Excepteur...
              </p>
              <div className="w-[380px] flex gap-1 justify-center items-center flex-col">
                <Progress
                  aria-label="Downloading..."
                  className="w-[380px]"
                  color="success"
                  showValueLabel={false}
                  size="md"
                  value={value}
                />
                <div className="flex gap-1 justify-between w-full px-[4px] text-[16px] text-secondary font-medium">
                  <div className="text-verdant-600">
                    <span>{100 - value}%</span> to complete
                  </div>
                  <div className="text-shark-300">
                    Goal $<span>20,000</span>
                  </div>
                </div>
              </div>
              <Button
                variant="shadow"
                className="flex gap-0 w-[160px] bg-verdant-800 text-white text-sm font-primary px-4 py-2 rounded-[20px] tracking-[1px]"
              >
                Donate Now
                <Image
                  src={'/icons/arrow-white-angel.svg'}
                  width={32}
                  height={32}
                  alt="arrow"
                />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
