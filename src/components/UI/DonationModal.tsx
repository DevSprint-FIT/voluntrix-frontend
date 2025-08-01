import React from 'react';
import Image from 'next/image';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from '@heroui/react';

interface DonationModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
}

export default function DonationModal({
  isOpen,
  onChange,
}: DonationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onChange}
      size="lg"
      className="rounded-2xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-center space-y-1 flex flex-col items-center pt-6 pb-7 px-10">
              <Image
                src="/icons/heart.svg"
                alt="Heart"
                width={50}
                height={50}
              />
              <h3 className="text-3xl mt-2 font-semibold text-shark-950 font-primary ">
                Make it ongoing!
              </h3>
              <p className="text-sm text-shark-700 font-normal font-secondary">
                your steady support helps us plan ahead and we value your every
                contribution.
              </p>
            </ModalHeader>
            <ModalBody className="flex flex-col gap-4 mb-8 items-center">
              <Button
                variant="shadow"
                isLoading={false}
                onPress={onClose}
                className="w-[350px] bg-verdant-600 hover:bg-verdant-700 text-white font-medium rounded-2xl py-6 text-sm tracking-wide"
              >
                Yes! Let me donate LKR 1,000
              </Button>
              <Button
                isLoading={false}
                variant="bordered"
                onPress={onClose}
                className="w-[350px] py-6 border-2 border-verdant-600 hover:border-verdant-700 hover:text-verdant-700 text-verdant-600 text-sm font-medium rounded-2xl tracking-wide"
              >
                No thanks. Complete my own Donation
              </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
