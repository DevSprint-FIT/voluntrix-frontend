'use client';

import Image from 'next/image';
import { Progress } from '@heroui/progress';
import { Button } from '@heroui/button';
import { EventType } from '@/types/EventType';
import { useRouter } from 'next/navigation';

export default function EventCard({ event }: { event: EventType }) {
  // const [isSaved, setIsSaved] = useState(false);

  // const handleSave = () => {
  //   setIsSaved((prevState) => !prevState);
  // };

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

  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/public/events/${event.eventId}`);
  };
  return (
    <div className="w-[310px] h-[460px] group rounded-[10px] bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 font-secondary overflow-hidden">
      {event && (
        <>
          <div className="h-[165px] relative overflow-hidden">
            <Image
              src={event.eventImageUrl} // '/images/DummyEvent2.png'
              className="rounded-t-[10px] transition-all duration-500 group-hover:scale-110 group-hover:brightness-50"
              width={310}
              height={165}
              alt={event.eventTitle}
            />
            <Button
              onPress={handleNavigate}
              className="w-[92px] h-[36px] rounded-[5px] border-white border-[0.5px] bg-transparent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-secondary text-center text-[12px] font-[500] text-shark-50 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
            >
              View Event
            </Button>
          </div>
          <div className="flex justify-center w-[308px] mt-[17px]">
            <div className="w-[258px]">
              <div className="flex flex-col items-start gap-4">
                <div className="flex w-full items-start">
                  <p className="w-[234px] text-shark-950 font-bold text-xl text-left text-wrap">
                    {event.eventTitle}
                  </p>
                  {/* <button onClick={handleSave}>
                    <Image
                      src={
                        isSaved ? '/icons/tick-circle.svg' : '/icons/save.svg'
                      }
                      width={24}
                      height={24}
                      alt="save"
                    />
                  </button> */}
                </div>
                {event.organizationName && (
                  <p
                    className="text-shark-900 font-medium text-md text-wrap"
                    style={{ marginTop: '-10px' }}
                  >
                    By {event.organizationName}
                  </p>
                )}
                {!event.donationEnabled &&
                  (() => {
                    const sentences = event.eventDescription.match(
                      /[^.!?]+[.!?]+/g
                    ) || [event.eventDescription];
                    const preview = sentences.slice(0, 2).join(' ');

                    return (
                      <p className="text-shark-900 text-[13px] font-normal text-left text-wrap">
                        {preview}
                      </p>
                    );
                  })()}
                <div className="flex items-center gap-2 flex-wrap">
                  {event.categories.map((category, index) => (
                    <div
                      key={index}
                      className="flex h-[22px] px-2 justify-center items-center rounded-[4px] bg-[#E7E7E7]"
                    >
                      <p className="text-[12px] font-primary font-bold text-shark-600 capitalize">
                        {category.categoryName}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-7">
                  <div className="flex gap-2 items-start">
                    <Image
                      src="/icons/calendar.svg"
                      width={20}
                      height={20}
                      alt="calendar"
                    />
                    <p className="font-secondary text-shark-900 text-[12px] font-bold text-left">
                      {formatDate(event.eventStartDate)} <br />
                      {event.eventTime && `at ${formatTime(event.eventTime)}`}
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
                      {event.eventLocation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {event.donationEnabled &&
            event.donations !== null &&
            event.donationGoal !== null && (
              <div className="flex justify-center w-[308px] mt-[20px]">
                <div className="w-[258px] flex gap-1 justify-center items-center flex-col">
                  <Progress
                    aria-label="Downloading..."
                    className="w-[249px]"
                    color="success"
                    showValueLabel={false}
                    size="md"
                    value={(event.donations / event.donationGoal) * 100}
                  />
                  <div className="flex gap-1 justify-between w-full px-[4px] text-[12px] text-secondary ">
                    <div className="text-verdant-600">
                      <span>
                        {Math.round(
                          100 - (event.donations / event.donationGoal) * 100
                        )}
                        %
                      </span>{' '}
                      to complete
                    </div>
                    <div className="text-shark-500">
                      Goal Rs. <span>{event.donationGoal}</span>
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
