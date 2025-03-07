'use client';

import Image from 'next/image';

export default function SearchbarActive() {
  return (
    <div className="w-[639px] flex flex-col justify-start items-center rounded-[20px] border-2 border-shark-200 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] py-3 gap-2">
      <div className="w-[607px] h-8 flex justify-center items-center">
        <input
          type="text"
          className="w-[575px] text-shark-950 font-secondary text-lg outline-none bg-transparent px-2"
          placeholder="Search for events by name"
        />
        <Image src={'icons/search.svg'} width={32} height={32} alt="search" />
      </div>
      <div className="w-[607px] h-[1px] bg-shark-200"></div>
      <div className="w-[607px] h-8 text-shark-300 text-lg font-secondary px-2">Search for events by name</div>
    </div>
  );
}
