"use client";

import Image from "next/image";
import { useState } from "react";

const EventCard = () => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (isSaved) {
      setIsSaved(false);
    } else {
      setIsSaved(true);
    }
  };

  return (
    <div className="w-[308px] h-[434px] rounded-[10px] bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 font-secondary">
      <div className="h-[165px]">
        <Image
          src="/images/DummyEvent1.png"
          className="rounded-t-[10px]"
          width={308}
          height={165}
          alt="event 1"
        />
      </div>
      <div className="flex justify-center w-[308px] h-[269px] mt-[17px]">
        <div className="w-[258px]">
          <div className="flex flex-col items-start gap-[14px]">
            <div className="flex flex-col items-start self-stretch">
              <div className="flex justify-between w-full items-start">
                <p className="text-shark-950 font-bold text-xl">
                  River Cleanup Drive
                </p>
                <button onClick={handleSave}>
                  <Image
                    src={isSaved ? "/icons/tick-circle.svg" : "/icons/save.svg"}
                    width={20}
                    height={20}
                    alt="save"
                    className="mt-1"
                  />
                </button>
              </div>
              <div className="text-shark-900 font-medium text-md">
                By EcoFriends
              </div>
            </div>
            <p className="text-shark-900 text-[13px] font-normal text-left">
              Help us restore the beauty of our local river by removing trash
              and debris.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex h-[22px] px-2 justify-center items-center rounded-[4px] bg-[#E7E7E7]">
                <p className="text-[12px] text-primary font-bold text-shark-600">
                  Public
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex gap-2 items-start">
                <Image
                  src="/icons/calendar.svg"
                  width={20}
                  height={20}
                  alt="save"
                />
                <p className="text-secondary text-shark-900 text-[12px] text-left w-[100px] font-bold">
                  Jan 02, 2025
                </p>
              </div>
              <div className="flex gap-2 items-start">
                <Image
                  src="/icons/location.svg"
                  width={20}
                  height={20}
                  alt="save"
                />
                <p className="text-secondary text-shark-900 text-[12px] text-left font-bold">
                  Reverside Park, Springfield
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
