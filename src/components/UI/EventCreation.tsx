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

export default function EventCreation() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [step, setStep] = useState(1);
  const progress = step * 25;

  const [isStep1Valid, setIsStep1Valid] = useState(false);

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));
  return (
    <>
      <Button onPress={onOpen}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="4xl"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent className="px-10">
          {(onClose) => (
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
                  <BasicInfoEC onValidityChange={setIsStep1Valid} />
                )}
                {step === 2 && <OrganizationEC />}
                {step === 3 && <SponsorshipsEC />}
                {step === 4 && <ReviewEC />}
              </ModalBody>
              <ModalFooter className="pt-0">
                <Button
                  isDisabled={step === 1}
                  onPress={handleBack}
                  className="bg-shark-700 text-white text-[15px] font-primary px-6 py-2 rounded-[20px] tracking-[1px]"
                >
                  Back
                </Button>
                <Button
                  isDisabled={step === 1 && !isStep1Valid}
                  onPress={() => (step === 4 ? onClose() : handleNext())}
                  className="bg-verdant-600 text-white text-[15px] font-primary px-6 py-2 rounded-[20px] tracking-[1px]"
                >
                  {step === 4 ? 'Finish' : 'Next'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
