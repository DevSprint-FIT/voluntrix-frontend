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
      size="md"
      className="rounded-2xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col items-center gap-1 pt-8 px-8 pb-6">
              <div className="relative w-16 h-16">
                <Image
                  src="/icons/heart.svg"
                  alt="Heart icon"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
              <h3 className="mt-2 text-3xl font-semibold text-shark-950 font-primary">
                Make it ongoing!
              </h3>
              <p className="text-center text-shark-600 font-medium text-base max-w-[320px] font-secondary leading-relaxed">
                Your steady support helps us plan ahead we truly value every
                contribution.
              </p>
            </ModalHeader>

            <ModalBody className="flex flex-col gap-5 px-8 pb-10 items-center">
              <Button
                variant="shadow"
                isLoading={false}
                onPress={onClose}
                className="w-full max-w-[360px] bg-verdant-600 hover:bg-verdant-700 text-white font-medium rounded-2xl py-6 text-sm transition-transform active:scale-95"
                aria-label="Donate LKR 1,000"
              >
                Yes! Let me donate LKR 1,000
              </Button>

              <Button
                isLoading={false}
                variant="bordered"
                onPress={onClose}
                className="w-full max-w-[360px] py-6 border-2 border-verdant-600 hover:border-verdant-700 hover:text-verdant-700 text-verdant-600 font-medium rounded-2xl text-sm transition-colors active:scale-95"
                aria-label="Complete own donation"
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
