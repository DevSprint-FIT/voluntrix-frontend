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
import { EventCreateData } from '@/types/EventCreateData';
import { OrganizationTitles } from '@/types/OrganizationTitles';

const blankEvent: EventCreateData = {
  eventTitle: '',
  eventDescription: '',
  eventLocation: '',
  eventStartDate: '',
  eventEndDate: '',
  eventTime: '',
  eventImageUrl: '',
  eventType: '',
  eventVisibility: '',
  eventStatus: '',
  sponsorshipEnabled: false,
  donationEnabled: false,
  categories: [],
  eventHostId: 0,
  organizationId: null,
};

export default function EventCreation() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const { isOpen: confirmOpen, onOpenChange: setConfirmOpen } = useDisclosure();
  const [step, setStep] = useState(1);
  const [isStep1Valid, setValid] = useState(false);
  const progress = step * 25;
  const [eventData, setEventData] = useState<EventCreateData>(blankEvent);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationTitles | null>(
    null
  );

  // const buildPreviewPayload = (data: EventCreateData) => ({
  //   ...data,
  //   categories: data.categories.map((id) => ({ categoryId: id })),
  // });

  const resetWizard = () => {
    setStep(1);
    setValid(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setConfirmOpen();
      return;
    }
    setWizardOpen(true);
  };

  const discardAndClose = () => {
    setEventData(blankEvent);
    setConfirmOpen();
    setWizardOpen(false);
  };

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const updateEventData = (changes: Partial<EventCreateData>) =>
    setEventData((prev) => ({ ...(prev ?? blankEvent), ...changes }));
  return (
    <>
      <Button onPress={() => setWizardOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={wizardOpen}
        onOpenChange={handleOpenChange}
        onClose={resetWizard}
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
                    onValidityChange={setValid}
                  />
                )}
                {step === 2 && (
                  <OrganizationEC
                    selectedOrg={selectedOrg}
                    setSelectedOrg={setSelectedOrg}
                  />
                )}
                {step === 3 && <SponsorshipsEC />}
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
                  isDisabled={step === 1 && !isStep1Valid}
                  onPress={() => (step === 4 ? setWizardOpen(false) : next())}
                  className="bg-verdant-600 text-white text-[15px] font-primary px-6 py-2 rounded-[20px] tracking-[1px]"
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
    </>
  );
}
