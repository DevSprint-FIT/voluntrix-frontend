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

const options = [
  { key: 'design', label: 'Design' },
  { key: 'editorial', label: 'Editorial' },
  { key: 'program', label: 'Program' },
];

export default function VolunteerApplication() {
  const [area, setArea] = useState<string | null>(null);
  const [isAgree, setIsAgree] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setArea(e.target.value);
  };

  return (
    <>
      <Button onPress={onOpen}>Open Modal</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
                    <p className="font-bold font-primary text-shark-950">
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
                    <p className="font-bold font-primary text-[1rem] text-shark-950">
                      Why do you want to be a volunteer for this event?
                    </p>
                    <textarea
                      name=""
                      id=""
                      className="rounded-[5px] border-[2px] border-shark-800 h-[110px] w-full p-2 resize-none"
                    />
                  </div>
                  <div className="flex gap-2 items-start">
                    <div
                      className="curser-pointer"
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
                  className="bg-shark-950 text-white text-sm font-primary px-6 py-2 rounded-[20px] tracking-[1px]"
                  onPress={onClose}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
