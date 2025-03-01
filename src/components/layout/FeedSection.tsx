import Image from "next/image";
import { Button } from "@heroui/button";

export default function FeedSection() {
  return (
    <div className="bg-gradient-to-r from-[#eafdf4] to-[#ffffff] w-full py-16 px-12 text-center flex items-center justify-center gap-36">
      <div className="max-w-lg pl-6 md:pl-8 md:text-left flex flex-col gap-5">
        <h1 className=" text-[3rem]  text-shark-950 font-primary leading-[3rem]">
          Celebrate Achievements and Stay Inspired
        </h1>
        <p className="text-shark-900 font-secondary text-lg leading-[1.8] ">
          Explore stories of impact shared by organizations. See how volunteers
          are making a difference and get inspired to be part of the change.
        </p>
        <Button variant="shadow" className="w-40 bg-shark-950 text-white text-md font-primary tracking-[0.8px] flex items-center gap-2 px-5 py-2 rounded-[20px]">
          Take a Tour
          <Image
            src="/icons/arrow.svg"
            alt="Arrow Icon"
            width={25}
            height={18}
          />
        </Button>
      </div>
      <div className="md:mt-0 flex space-x-6">
        <Image
          src="/images/posts.webp"
          alt="Volunteer 1 Image"
          width={600}
          height={600}
          className="pr-4"
        />
      </div>
    </div>
  );
}
