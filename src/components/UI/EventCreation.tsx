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
import BasicInfoEC from './BasicInfoEC';
import OrganizationEC from './OrganizationEC';
import SponsorshipsEC from './SponsorshipsEC';

export default function EventCreation() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
                  <div className="flex gap-2 items-center justify-center">
                    <Image
                      src={'/icons/one-circle.svg'}
                      width={28}
                      height={28}
                      alt="one"
                    />
                    Basic Info
                  </div>
                  <div className="flex gap-2 items-center justify-center">
                    <Image
                      src={'/icons/two-circle.svg'}
                      width={28}
                      height={28}
                      alt="two"
                    />
                    Organizations
                  </div>
                  <div className="flex gap-2 items-center justify-center">
                    <Image
                      src={'/icons/three-circle.svg'}
                      width={28}
                      height={28}
                      alt="three"
                    />
                    Sponsorships
                  </div>
                  <div className="flex gap-2 items-center justify-center">
                    <Image
                      src={'/icons/four-circle.svg'}
                      width={28}
                      height={28}
                      alt="four"
                    />
                    Review
                  </div>
                </div>
                <Progress
                  aria-label="Downloading..."
                  className="w-[730px] mt-2"
                  color="success"
                  showValueLabel={false}
                  size="sm"
                  value={25}
                />
              </ModalHeader>
              <ModalBody>
                {/* <BasicInfoEC /> */}
                {/* <OrganizationEC /> */}
                <SponsorshipsEC />
              </ModalBody>
              <ModalFooter className="pt-0">
                <Button
                  variant="shadow"
                  // disabled={!isFormValid}
                  className="bg-shark-700 text-white text-[15px] font-primary px-6 py-2 rounded-[20px] tracking-[1px]"
                  onPress={() => {
                    // if (!isFormValid) return;

                    // 👉 TODO: send data to your API here
                    // await fetch(...)

                    // setArea(null);
                    // setReason('');
                    // setIsAgree(false);
                    onClose();
                    // openSuccessModal();
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="shadow"
                  // disabled={!isFormValid}
                  className="bg-verdant-600 text-white text-[15px] font-primary px-6 py-2 rounded-[20px] tracking-[1px]"
                  onPress={() => {
                    // if (!isFormValid) return;

                    // 👉 TODO: send data to your API here
                    // await fetch(...)

                    // setArea(null);
                    // setReason('');
                    // setIsAgree(false);
                    onClose();
                    // openSuccessModal();
                  }}
                >
                  Next
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
