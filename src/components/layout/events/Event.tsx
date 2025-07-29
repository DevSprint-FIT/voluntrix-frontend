'use client';

import { Button, Progress, useDisclosure } from '@heroui/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { EventType } from '@/types/EventType';
import VolunteerApplication from '@/components/UI/VolunteerApplication';
import SponsorshipsModal from '@/components/UI/SponsorshipsModal';
import DonationModal from '@/components/UI/DonationModal';
import { fetchVolunteer } from '@/services/volunteerApplicationService';
import { SponsorshipType } from '@/types/SponsorshipType';

export default function Event({
  event,
  sponsorshipNames,
  sponsorships,
}: {
  event: EventType;
  sponsorshipNames: string[];
  sponsorships: SponsorshipType[];
}) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isEligibleToApply, setIsEligibleToApply] = useState<boolean>(false);

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

  const {
    isOpen: isFormOpen,
    onOpen: openFormModal,
    onOpenChange: onFormChange,
  } = useDisclosure();

  useEffect(() => {
    const checkEligibility = async () => {
      console.log('🔍 Checking eligibility...');
      console.log('Event visibility:', event.eventVisibility);
      console.log('Organization ID:', event.organizationId);

      if (event.eventVisibility === 'PUBLIC') {
        console.log('Public event — eligible by default.');
        setIsEligibleToApply(true);
        return;
      }

      if (!event.organizationId) {
        console.warn(
          'Organization ID is missing. Cannot determine eligibility.'
        );
        return;
      }

      try {
        const vol = await fetchVolunteer();

        console.log('Fetched volunteer:', vol);

        const orgInstitute = event.institute?.trim().toLowerCase();
        const volInstitute = vol?.institute?.trim().toLowerCase();

        console.log('Organization institute:', orgInstitute);
        console.log('Volunteer institute:', volInstitute);

        if (orgInstitute && volInstitute && orgInstitute === volInstitute) {
          console.log('Institutes match. Volunteer is eligible.');
          setIsEligibleToApply(true);
        } else {
          console.warn('Institutes do not match. Volunteer is not eligible.');
          setIsEligibleToApply(false);
        }
      } catch (error) {
        console.error('Error during eligibility check:', error);
        setIsEligibleToApply(false);
      }
    };

    checkEligibility();
  }, [event.eventVisibility, event.organizationId, event.institute]);

  return (
    <div className="w-full flex items-start justify-center mb-[88px]">
      <div className="w-[1200px] flex flex-col items-center justify-start">
        <div className="mt-14 flex gap-20">
          <div className="w-[522px] flex items-center justify-end">
            <div className="w-[495px] h-[369px] relative overflow-hidden">
              <Image
                src={event.eventImageUrl} //'/images/DummyEvent2.png'
                width={495}
                height={369}
                alt="event image"
              />
            </div>
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
                {event.organizationId !== null && (
                  <div className="flex gap-2 items-center">
                    {event.organizationImageUrl && (
                      <Image
                        src={event.organizationImageUrl}
                        className="rounded-full"
                        width={40}
                        height={40}
                        alt="organization"
                        unoptimized
                      />
                    )}
                    <p className="text-shark-800 font-medium text-2xl text-wrap">
                      By {event.organizationName}
                    </p>
                  </div>
                )}
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
              {isEligibleToApply && (
                <Button
                  onPress={openFormModal}
                  variant="shadow"
                  className="bg-shark-950 text-white text-sm font-primary px-4 py-2 rounded-[20px] tracking-[1px]"
                >
                  Volunteer Now
                </Button>
              )}
              <VolunteerApplication
                isFormOpen={isFormOpen}
                onFormChange={onFormChange}
                eventId={event.eventId}
                isEligibleToApply={isEligibleToApply}
              />
            </div>
          </div>
        </div>
        <div className="w-[1150px] flex gap-10 justify-start">
          {event.sponsorshipEnabled && (
            <div className="w-[719px] flex flex-col gap-7 justify-start mt-20">
              <p className="text-4xl font-secondary font-medium text-shark-950">
                Sponsorships
              </p>
              <p className="w-[690px] text-shark-950 text-[16px] font-normal text-left text-wrap">
                Empower our mission by becoming a valued sponsor. Your support
                helps us create a greater impact through meaningful
                partnerships.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {sponsorshipNames.map((tag, index) => (
                  <div
                    key={index}
                    className="flex justify-center items-center rounded-[4px] bg-[#E7E7E7]"
                  >
                    <p className="text-[14px] font-primary px-3 py-1 font-bold text-shark-600 capitalize">
                      {tag}
                    </p>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                color="default"
                className="w-[272px] h-[79px] flex items-center justify-center gap-3 rounded-[20px] border border-shark-600 bg-white"
                onPress={() => {
                  if (event.sponsorshipProposalUrl) {
                    window.open(event.sponsorshipProposalUrl, '_blank');
                  }
                }}
              >
                <Image
                  src={'/icons/document.svg'}
                  width={40}
                  height={40}
                  alt="document"
                />
                <div className="flex flex-col">
                  <p className="font-medium text-shark-950 text-md">
                    Sponsorship-proposal
                  </p>
                </div>
              </Button>
              <Button
                variant="shadow"
                className="w-[160px] bg-shark-950 text-white text-sm font-primary px-4 py-2 rounded-[20px] tracking-[1px]"
                onPress={() => setIsSponsorModalOpen(true)}
              >
                Sponsor Now
              </Button>
              {isSponsorModalOpen && (
                <SponsorshipsModal
                  isOpen={isSponsorModalOpen}
                  onClose={() => setIsSponsorModalOpen(false)}
                  sponsorships={sponsorships}
                />
              )}
            </div>
          )}
          {event.donationEnabled &&
            event.donations !== null &&
            event.donationGoal !== null && (
              <div className="w-[400px] flex flex-col gap-7 justify-start mt-20">
                <p className="text-4xl font-secondary font-medium text-shark-950">
                  Donations
                </p>
                <p className="text-shark-950 text-[16px] font-normal text-left text-wrap">
                  Every contribution counts. Help us reach our goal and drive
                  positive change. Your donation makes a real difference.
                </p>
                <div className="w-[380px] flex gap-1 justify-center items-center flex-col">
                  <Progress
                    aria-label="Downloading..."
                    className="w-[380px]"
                    color="success"
                    showValueLabel={false}
                    size="md"
                    value={(event.donations / event.donationGoal) * 100}
                  />
                  <div className="flex gap-1 justify-between w-full px-[4px] text-[16px] text-secondary font-medium">
                    <div className="text-verdant-600">
                      <span>
                        {100 - (event.donations / event.donationGoal) * 100}%
                      </span>{' '}
                      to complete
                    </div>
                    <div className="text-shark-300">
                      Goal Rs. <span>{event.donationGoal}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="shadow"
                  className="flex gap-0 w-[160px] bg-verdant-800 text-white text-sm font-primary px-4 py-2 rounded-[20px] tracking-[1px]"
                  onPress={() => setIsDonationModalOpen(true)}
                >
                  Donate Now
                  <Image
                    src={'/icons/arrow-white-angel.svg'}
                    width={32}
                    height={32}
                    alt="arrow"
                  />
                </Button>
                {isDonationModalOpen && (
                  <DonationModal
                    open={isDonationModalOpen}
                    setOpen={setIsDonationModalOpen}
                  />
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
