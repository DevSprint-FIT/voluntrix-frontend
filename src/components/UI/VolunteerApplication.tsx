'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select,
  SelectItem,
} from '@heroui/react';
import Link from 'next/link';

interface VolunteerApplicationProps {
  isFormOpen: boolean;
  onFormChange: (open: boolean) => void;
}

const options = [
  { key: 'design', label: 'Design' },
  { key: 'editorial', label: 'Editorial' },
  { key: 'program', label: 'Program' },
];

export default function VolunteerApplication({
  isFormOpen,
  onFormChange,
}: VolunteerApplicationProps) {
  const [area, setArea] = useState<string | null>(null);
  const [isAgree, setIsAgree] = useState<boolean>(false);

  const {
    isOpen: isSuccessOpen,
    onOpen: openSuccessModal,
    onOpenChange: onSuccessChange,
  } = useDisclosure();

  const [reason, setReason] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setArea(e.target.value);
  };

  const isFormValid = Boolean(area && reason.trim() && isAgree);

  return (
    <>
      <Modal isOpen={isFormOpen} onOpenChange={onFormChange}>
        <ModalContent className="px-4">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center gap-1">
                <div className="mt-5 text-shark-950 font-primary font-bold text-[28px]">
                  Be Part of the Event Crew
                </div>
                <p className="mt-1 text-shark-800 font-secondary font-medium text-[14px] text-center">
                  Help us make this event a success with your unique
                  contribution!
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-[14px]">
                  <div className="space-y-3 font-medium text-shark-800 text-[1rem] font-secondary">
                    <p className="font-medium font-primary text-shark-950">
                      Which area would you like to contribute to?
                    </p>
                    <Select
                      placeholder="Contribution Area"
                      variant="bordered"
                      size="sm"
                      value={area ?? undefined}
                      onChange={handleChange}
                      className="w-[170px] rounded-md text-shark-500"
                      classNames={{
                        base: 'border-shark-800',
                        trigger: 'border-shark-900',
                      }}
                    >
                      {options.map((option) => (
                        <SelectItem
                          key={option.key}
                          value={option.key}
                          className="font-medium text-shark-800 font-secondary"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-3 font-medium text-shark-800 text-[1rem] font-secondary">
                    <p className="font-medium font-primary text-[1rem] text-shark-950">
                      Why do you want to be a volunteer for this event?
                    </p>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="rounded-[5px] border-[2px] border-shark-800 h-[110px] w-full p-2 resize-none"
                    />
                  </div>
                  <div className="flex gap-2 items-start">
                    <div
                      className="cursor-pointer"
                      onClick={() => setIsAgree((prev) => !prev)}
                    >
                      {!isAgree ? (
                        <Image
                          src={'/icons/tick-box.svg'}
                          alt="tickbox"
                          width={42}
                          height={42}
                        />
                      ) : (
                        <Image
                          src={'/icons/tick-box-green.svg'}
                          alt="tick"
                          width={42}
                          height={42}
                        />
                      )}
                    </div>
                    <div className="font-primary text-sm font-medium text-shark-900">
                      I agree to follow the event guidelines, commit to my
                      responsibilities, represent the event professionally, and
                      accept the{' '}
                      <Link href={'#'} className="underline">
                        Terms & Conditions
                      </Link>{' '}
                      of volunteering.
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="shadow"
                  disabled={!isFormValid}
                  className={`bg-shark-950 text-white text-sm font-primary px-6 py-2 rounded-[20px] tracking-[1px] 
              ${!isFormValid && 'opacity-40 cursor-not-allowed'}`}
                  onPress={() => {
                    if (!isFormValid) return;

                    // 👉 TODO: send data to your API here
                    // await fetch(...)

                    setArea(null);
                    setReason('');
                    setIsAgree(false);
                    onClose();
                    openSuccessModal();
                  }}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isSuccessOpen} onOpenChange={onSuccessChange}>
        <ModalContent className="pt-8 pb-10 px-4">
          {
            <>
              <ModalBody className="flex flex-col justify-center items-center gap-1">
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
              </ModalBody>
            </>
          }
        </ModalContent>
      </Modal>
    </>
  );
}
