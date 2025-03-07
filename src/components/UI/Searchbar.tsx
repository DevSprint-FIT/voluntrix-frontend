'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function Searchbar() {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <div
      className={`w-[639px] flex flex-col justify-start items-center rounded-${isFocused ? '[20px]' : '[40px]'} border-2 border-shark-200 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] py-3 gap-2`}
    >
      <div className="w-[607px] h-8 flex justify-center items-center">
        <input
          type="text"
          className="w-[575px] text-shark-950 text-lg outline-none bg-transparent px-2"
          placeholder={isFocused ? '' : 'Search for events by name'}
          value={inputValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(inputValue.trim() !== '')}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Image src={'/icons/search.svg'} width={32} height={32} alt="search" />
      </div>
      {isFocused && (
        <>
          <div className="w-[607px] h-[1px] bg-shark-200"></div>
          <div className="w-[607px] h-8 text-shark-300 text-lg px-2">Search for events by name</div>
        </>
      )}
    </div>
  );
}
