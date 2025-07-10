
"use client";

import Image from "next/image";
import { Button } from "@heroui/react";


export default function RewardBanner() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-white to-verdant-50 p-8 rounded-lg shadow-sm px-20">
      <div className="max-w-xl text-center md:text-left pl-10">
        <h1 className="text-3xl font-bold text-shark-950 mb-4">
          Great Volunteers Deserve Great Rewards
        </h1>
        <p className="text-shark-600 mb-6">
          Earn points every time you attend an event or complete a task. Track
          your progress and celebrate your impact!
        </p>
        <Button className="bg-shark-950 text-white px-6 py-2 rounded-full hover:bg-shark-800 self-center md:self-start">
          Learn more now
        </Button>
      </div>
      <div className="mt-6 md:mt-0 pr-6">
        <Image
          src ="/images/service-3.png"
          alt="Rewards banner"
          width={400}
          height={300}
          className="rounded"
        />
      </div>
    </div>
  );
}
