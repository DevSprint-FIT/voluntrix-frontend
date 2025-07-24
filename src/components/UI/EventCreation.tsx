'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Progress,
} from '@heroui/react';
import Image from 'next/image';
import { useState } from 'react';
import BasicInfoEC from './BasicInfoEC';
import OrganizationEC from './OrganizationEC';
import SponsorshipsEC from './SponsorshipsEC';
import ReviewEC from './ReviewEC';
import { EventCreateType } from '@/types/EventCreateType';
import { OrganizationTitles } from '@/types/OrganizationTitles';
import { createEvent } from '@/services/eventService';
import { createEventInvitation } from '@/services/eventInvitationService';

const blankEvent: EventCreateType = {
  eventTitle: '',
  eventDescription: '',
  eventLocation: '',
  eventStartDate: '',
  eventEndDate: '',
  eventTime: '',
  eventImageUrl: '',
  eventType: '',
  eventVisibility: '',
  eventStatus: 'PENDING',
  sponsorshipEnabled: false,
  donationEnabled: false,
  categories: [],
  eventHostId: 1,
  organizationId: null,
};

export default function EventCreation() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const { isOpen: confirmOpen, onOpenChange: setConfirmOpen } = useDisclosure();
  const { isOpen: isSuccessOpen, onOpenChange: setSuccessOpen } =
    useDisclosure();
  const [step, setStep] = useState(1);
  const [isStep1Valid, setStep1Valid] = useState(false);
  // const [isStep2Valid, setStep2Valid] = useState(false);
  const progress = step * 25;
  const [eventData, setEventData] = useState<EventCreateType>(blankEvent);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationTitles | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionType, setSubmissionType] = useState<
    'CREATED' | 'PENDING' | null
  >(null);
  const isStep2Invalid =
    step === 2 && eventData.eventVisibility === 'PRIVATE' && !selectedOrg;

  const resetWizard = () => {
    setEventData(blankEvent);
    setSelectedOrg(null);
    setStep(1);
    setStep1Valid(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setConfirmOpen();
      return;
    }
    setWizardOpen(true);
  };

  const discardAndClose = () => {
    resetWizard();
    setConfirmOpen();
    setWizardOpen(false);
  };

  const next = () => {
    if (step === 2) {
      const isPrivate = eventData.eventVisibility === 'PRIVATE';
      const isPublic = eventData.eventVisibility === 'PUBLIC';

      if (!selectedOrg) {
        if (isPrivate) {
          return;
        }
        if (isPublic) {
          setStep(4);
          return;
        }
      }
      setStep(3);
      return;
    }
    setStep((s) => Math.min(s + 1, 4));
  };

  const back = () => {
    if (step === 4 && !selectedOrg) {
      setStep(2);
    } else {
      setStep((s) => Math.max(s - 1, 1));
    }
  };

  const updateEventData = (changes: Partial<EventCreateType>) =>
    setEventData((prev) => ({ ...(prev ?? blankEvent), ...changes }));

  const handleFinish = async () => {
    setIsSubmitting(true);
    const rawCategories = eventData.categories;

    const categoryArray: { categoryId: number }[] = Array.isArray(rawCategories)
      ? (rawCategories as { categoryId: number }[])
      : (Object.values(rawCategories) as { categoryId: number }[]);

    let eventTime = eventData.eventTime;
    if (eventTime && eventTime.length === 5) {
      eventTime += ':00';
    }

    const payload = {
      ...eventData,
      eventTime,
      eventStatus: 'DRAFT',
      organizationId: selectedOrg?.id ?? null,
      categories: categoryArray.map((cat) => ({
        categoryId: cat.categoryId,
      })),
    };

    console.log(
      'Final payload sent to backend:',
      JSON.stringify(payload, null, 2)
    );

    try {
      const createdEvent = await createEvent(payload);
      console.log('Event created successfully:', createdEvent);

      const eventId = createdEvent?.eventId;
      const organizationId = selectedOrg?.id;

      if (eventId && organizationId) {
        await createEventInvitation(eventId, organizationId);
        console.log('Event invitation sent successfully');
        setSubmissionType('PENDING');
      } else {
        console.log('No organization selected, skipping invitation creation.');
        setSubmissionType('CREATED');
      }

      setWizardOpen(false);
      setSuccessOpen();
      resetWizard();
    } catch (err) {
      console.error('Failed to create event or send invitation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onPress={() => setWizardOpen(true)}
        className="bg-verdant-700 text-white text-[15px] font-primary px-6 py-2 rounded-[20px] tracking-[1px]"
      >
        Create Event
      </Button>
      <Modal
        isOpen={wizardOpen}
        onOpenChange={handleOpenChange}
        size="4xl"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent className="px-10">
          {() => (
            <>
              <ModalHeader className="flex flex-col items-center gap-1">
                <div className="mt-2 text-shark-950 font-primary font-medium text-[28px]">
                  Bring Your Event to Life
                </div>
                <p className="text-shark-700 font-secondary font-normal text-[15px] text-center">
                  Let&apos;s walk through the steps to set up your event and
                  start making an impact.
                </p>
                <div className="mt-4 flex items-center justify-center gap-20 text-shark-950 font-secondary font-medium text-[14px]">
                  {['one', 'two', 'three', 'four'].map((n, idx) => (
                    <div
                      key={n}
                      className="flex gap-2 items-center justify-center"
                    >
                      <Image
                        src={`/icons/${n}-circle.svg`}
                        width={28}
                        height={28}
                        alt={n}
                      />
                      {
                        [
                          'Basic Info',
                          'Organizations',
                          'Sponsorships',
                          'Review',
                        ][idx]
                      }
                    </div>
                  ))}
                </div>
                <Progress
                  aria-label="Progress"
                  className="w-[730px] mt-2"
                  color="success"
                  showValueLabel={false}
                  size="sm"
                  value={progress}
                />
              </ModalHeader>
              <ModalBody>
                {step === 1 && (
                  <BasicInfoEC
                    data={eventData}
                    onChange={updateEventData}
                    onValidityChange={setStep1Valid}
                  />
                )}
                {step === 2 && (
                  <OrganizationEC
                    selectedOrg={selectedOrg}
                    setSelectedOrg={setSelectedOrg}
                  />
                )}
                {step === 3 && (
                  <SponsorshipsEC data={eventData} onChange={updateEventData} />
                )}
                {step === 4 && <ReviewEC />}
              </ModalBody>
              <ModalFooter className="pt-0">
                <Button
                  isDisabled={step === 1}
                  onPress={back}
                  className="bg-shark-700 text-white text-[15px] font-primary px-6 py-2 rounded-[20px] tracking-[1px]"
                >
                  Back
                </Button>
                <Button
                  isLoading={isSubmitting}
                  isDisabled={
                    (step === 1 && !isStep1Valid) ||
                    (step === 4 && isSubmitting) ||
                    (step === 2 && isStep2Invalid)
                  }
                  onPress={() => {
                    if (step === 4) {
                      handleFinish();
                    } else {
                      next();
                    }
                  }}
                  className="bg-verdant-700 text-white text-[15px] font-primary px-6 py-2 rounded-[20px] tracking-[1px]"
                >
                  {step === 4 ? 'Finish' : 'Next'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={confirmOpen}
        onOpenChange={setConfirmOpen}
        size="md"
        isDismissable={false}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="font-primary font-medium text-shark-950 text-[22px]">
                Unsaved Changes
              </ModalHeader>
              <ModalBody className="py-0 font-secondary font-normal text-shark-950 text-[15px]">
                Your event setup isn&apos;t complete. If you exit now, all
                unsaved progress will be lost. Would you like to discard your
                changes or continue editing?
              </ModalBody>
              <ModalFooter>
                <Button
                  onPress={() => setConfirmOpen()}
                  className="bg-shark-700 text-white text-[15px] font-primary px-4 py-2 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onPress={discardAndClose}
                  className="bg-red-600 text-white text-[15px] font-primary px-4 py-2 rounded-xl"
                >
                  Discard
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isSuccessOpen} onOpenChange={setSuccessOpen}>
        <ModalContent className="pt-8 pb-10 px-4">
          <>
            <ModalBody className="flex flex-col justify-center items-center gap-1">
              {submissionType === 'CREATED' ? (
                <>
                  <Image
                    src={'/icons/tick-circle.svg'}
                    width={56}
                    height={56}
                    alt="success"
                  />
                  <div className="mt-4 text-center font-bold font-primary text-shark-900 text-2xl">
                    Event Created Successfully
                  </div>
                  <div className="mt-2 text-center font-normal font-secondary text-shark-800 text-sm">
                    Your event has been created. You can now manage it in your
                    dashboard.
                  </div>
                </>
              ) : (
                <>
                  <Image
                    src={'/icons/tick-circle.svg'}
                    width={56}
                    height={56}
                    alt="success"
                  />
                  <div className="mt-4 text-center font-bold font-primary text-shark-900 text-2xl">
                    Review in Progress
                  </div>
                  <div className="mt-2 text-center font-normal font-secondary text-shark-800 text-sm">
                    Thanks for applying! Your application is under review.
                    You&apos;ll be notified once it&apos;s approved or declined.
                  </div>
                </>
              )}
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
