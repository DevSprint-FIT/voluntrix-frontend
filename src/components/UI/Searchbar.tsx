'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import FilterTag from './FilterTag';

interface SearchbarProps {
  isFilterOpen: boolean;
}

export default function Searchbar({ isFilterOpen }: SearchbarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const filterRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      filterRef.current &&
      !filterRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      setIsFocused(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFocused, handleClickOutside]);

  return (
    <div
      className={`absolute w-[639px] flex flex-col justify-start items-center rounded-${
        isFocused ? '[20px]' : '[40px]'
      } bg-white border-2 border-shark-200 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] py-3 gap-2 z-10`}
    >
      <div className="w-[607px] h-6 flex justify-center items-center">
        <input
          type="text"
          ref={inputRef}
          className="w-[575px] text-shark-950 text-lg outline-none bg-transparent px-2"
          placeholder={isFocused ? '' : 'Search for events by name'}
          value={inputValue}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Image
          src="/icons/search.svg"
          width={32}
          height={32}
          alt="Search icon"
          className="cursor-pointer"
        />
      </div>

      {isFocused && (
        <div
          ref={filterRef}
          className="w-[639px] flex flex-col items-center justify-start rounded-[20px] gap-1"
        >
          <div className="w-[607px] h-[1px] bg-shark-200"></div>
          <div className="w-[639px] relative flex flex-col items-center justify-start text-shark-300 text-lg">
            <div className="w-[635px] h-8 flex justify-center items-start text-shark-300 text-md mt-1 hover:bg-shark-50 rounded-lg">
              <p className="w-[591px]">Search for events by name</p>
            </div>
          </div>

          {isFilterOpen && (
            <>
              <div className="w-[583px] font-secondary text-shark-800 font-medium text-md mt-4">
                Filters
              </div>
              <div className="w-[607px] flex flex-wrap justify-start items-center mt-1 gap-x-2 gap-y-1">
                <FilterTag name="Colombo" />
                <FilterTag name="Colombo" />
                <FilterTag name="Colombo" />
                <FilterTag name="Colombo" />
                <FilterTag name="Colombo" />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
