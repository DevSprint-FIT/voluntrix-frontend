import Image from "next/image";

export default function FeedSection() {
  return (
    <div className="bg-gradient-to-r from-[#D0FBE7] to-[#edfdf6] w-full py-24 px-12 text-center flex items-center justify-center gap-36">
      <div className="max-w-lg pl-6 md:pl-8 md:text-left flex flex-col gap-5">
        <h1 className=" text-[2.5rem]  text-shark-950 font-primary leading-[3rem]">
          Celebrate Achievements and Stay Inspired
        </h1>
        <p className="text-shark-900 font-secondary text-[17px] leading-[1.8] ">
          Explore stories of impact shared by organizations. See how volunteers
          are making a difference and get inspired to be part of the change.
        </p>
        <button className="w-40 bg-shark-950 text-white text-md font-primary tracking-[0.8px] flex items-center gap-2 px-5 py-2 rounded-lg shadow-md">
          Take a Tour
          <Image
            src="/icons/arrow.svg"
            alt="Arrow Icon"
            width={25}
            height={18}
          />
        </button>
      </div>
      <div className="md:mt-0 flex space-x-6">
        <Image
          src="/images/posts.png"
          alt="Volunteer 1 Image"
          width={600}
          height={600}
          className="pr-4"
        />
      </div>
    </div>
  );
}
