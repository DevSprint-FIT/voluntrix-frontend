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
  Select,
  SelectItem,
} from '@heroui/react';
import Image from 'next/image';
import { useState } from 'react';

const eventTypes = [
  { key: 'private', label: 'Private' },
  { key: 'public', label: 'Public' },
];

export default function EventCreation() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [area, setArea] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setArea(e.target.value);
  };

  return (
    <>
      <Button onPress={onOpen}>Open Modal</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
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
                <div className="mt-1 flex items-center justify-center gap-20 text-shark-950 font-secondary font-medium text-[13px]">
                  <div className="flex gap-2 items-center justify-center">
                    <Image
                      src={'/icons/one-circle.svg'}
                      width={24}
                      height={24}
                      alt="one"
                    />
                    Basic Info
                  </div>
                  <div className="flex gap-2 items-center justify-center">
                    <Image
                      src={'/icons/two-circle.svg'}
                      width={24}
                      height={24}
                      alt="two"
                    />
                    Volunteers
                  </div>
                  <div className="flex gap-2 items-center justify-center">
                    <Image
                      src={'/icons/three-circle.svg'}
                      width={24}
                      height={24}
                      alt="three"
                    />
                    Sponsorships/Donations
                  </div>
                  <div className="flex gap-2 items-center justify-center">
                    <Image
                      src={'/icons/four-circle.svg'}
                      width={24}
                      height={24}
                      alt="four"
                    />
                    Review
                  </div>
                </div>
                <Progress
                  aria-label="Downloading..."
                  className="w-[700px]"
                  color="success"
                  showValueLabel={false}
                  size="sm"
                  value={25}
                />
              </ModalHeader>
              <ModalBody className="pb-0">
                <div className="felx flex-col">
                  <div className="flex justify-between">
                    <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
                      Event Title
                      <input
                        type="text"
                        className="border-[2px] border-shark-300 text-shark-950 pl-2 py-1 rounded-lg w-[350px] placeholder:text-shark-300"
                        placeholder="Enter event title"
                      />
                    </label>
                    <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
                      Event Location
                      <input
                        type="text"
                        className="border-[2px] border-shark-300 text-shark-950 pl-2 py-1 rounded-lg w-[350px] placeholder:text-shark-300"
                        placeholder="Enter event location"
                      />
                    </label>
                  </div>
                  <div className="flex flex-col mt-2">
                    <label className="font-secondary font-medium text-shark-950 text-[15px]">
                      Event Description
                      <textarea
                        placeholder="Describe your event"
                        className="resize-none border-[2px] border-shark-300 text-shark-950 pl-2 pt-1 rounded-lg w-full placeholder:text-shark-300 h-[80px]"
                      />
                    </label>
                    <div className="w-full text-right font-secondary font-normal text-shark-800 text-[11px]">
                      0/150 words
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <label className="font-secondary font-medium text-shark-950 text-[15px]">
                      Event Type
                      <Select
                        placeholder="Select type"
                        variant="bordered"
                        size="sm"
                        value={area ?? undefined}
                        onChange={handleChange}
                        className="w-[170px] rounded-2xl text-shark-300 border-shark-300"
                        classNames={{
                          base: 'border-shark-300',
                          trigger: 'border-shark-300',
                        }}
                      >
                        {eventTypes.map((eventType) => (
                          <SelectItem
                            key={eventType.key}
                            value={eventType.key}
                            className="font-medium text-shark-800 font-secondary text-[15px]"
                          >
                            {eventType.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </label>
                    <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
                      Start Date
                      <input
                        type="date"
                        className="w-[141px] h-8 border-2 border-shark-300 rounded-lg text-shark-300"
                        value={''}
                        // onChange={(e) =>
                        //   Todo
                        // }
                      />
                    </label>
                    <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
                      End Date
                      <input
                        type="date"
                        className="w-[141px] h-8 border-2 border-shark-300 rounded-lg text-shark-300"
                        value={''}
                        // onChange={(e) =>
                        //   Todo
                        // }
                      />
                    </label>
                    <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
                      Event Time
                      <input
                        type="time"
                        className="px-4 rounded-lg border-[2px] h-8 border-shark-300 text-shark-500 placeholder:text-shark-400 focus:ring-shark-400 focus:border-shark-400"
                        // value={""}
                        // onChange={/* setState */}
                      />
                    </label>
                  </div>
                  <div className="mt-3 font-secondary font-medium text-shark-950 text-[15px]">
                    Event Category
                  </div>
                  <div className="text-[15px] font-secondary text-shark-950 font-normal flex gap-5">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="categories"
                        value="Tech"
                        className="accent-verdant-600"
                      />
                      Environment
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        className="accent-verdant-600"
                        type="checkbox"
                        name="categories"
                        value="Tech"
                      />
                      Sport
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        className="accent-verdant-600"
                        type="checkbox"
                        name="categories"
                        value="Tech"
                      />
                      Technology
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        className="accent-verdant-600"
                        type="checkbox"
                        name="categories"
                        value="Tech"
                      />
                      Charity
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        className="accent-verdant-600"
                        type="checkbox"
                        name="categories"
                        value="Tech"
                      />
                      Education
                    </label>
                  </div>
                  <label className="mt-3 flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
                    Upload Event Image
                    <input
                      type="file"
                      accept="image/*"
                      // onChange={(e) => setFile(e.target.files?.[0] || null)}
                      required
                      className="mt-1 file:text-[15px] text-[14px] text-shark-950 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:font-medium file:text-shark-950 file:border-0 file:bg-shark-200"
                    />
                  </label>
                </div>
              </ModalBody>
              <ModalFooter className="pt-0">
                <Button color="danger" variant="light" onPress={onClose}>
                  Clear
                </Button>
                <Button color="primary" onPress={onClose}>
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
