'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import FilterTag from './FilterTag';
import axios from 'axios';

type Filters = {
  startDate: string;
  endDate: string;
  province: string;
  district: string;
  categories: string[];
  privateSelected: boolean;
  publicSelected: boolean;
};

interface SearchbarProps {
  filters: Filters;
}

export default function Searchbar({ filters }: SearchbarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeFilterTags, setActiveFilterTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [eventTitles, setEventTitles] = useState<string[]>([]);

  const filterRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    const tags: string[] = [];

    if (filters.province) tags.push(filters.province);
    if (filters.district) tags.push(filters.district);
    if (filters.startDate) tags.push(`From: ${filters.startDate}`);
    if (filters.endDate) tags.push(`To: ${filters.endDate}`);
    if (filters.privateSelected) tags.push('Private');
    if (filters.publicSelected) tags.push('Public');
    filters.categories.forEach((category) => tags.push(category));

    setActiveFilterTags(tags);
    setIsFilterOpen(tags.length > 0);
  }, [filters]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (inputValue.trim()) {
        const filtered = eventTitles.filter((title) =>
          title.toLowerCase().includes(inputValue.toLowerCase())
        );
        setSearchResults(filtered.length ? filtered : ['No results found']);
      } else {
        setSearchResults(['Search for events by name']);
      }
    }, 200);
  }, [inputValue, eventTitles]);

  useEffect(() => {
    const fetchEventTitles = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8080/api/public/v1/events/names'
        );
        const titles = res.data
          .map((event: { eventTitle: string }) => event.eventTitle)
          .filter((title: string) => title);
        setEventTitles(titles);
      } catch (error) {
        console.error('Failed to fetch event titles:', error);
      }
    };
    fetchEventTitles();
  }, []);

  return (
    <div
      className={`absolute w-[639px] flex flex-col justify-start items-center rounded-${
        isFocused ? '[20px]' : '[40px]'
      } bg-white border-2 border-shark-200 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] py-3 gap-2 z-20`}
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
          autoComplete="off"
          aria-label="Search for events"
        />
        <button aria-label="Search">
          <Image
            src="/icons/search.svg"
            width={32}
            height={32}
            alt="Search icon"
          />
        </button>
      </div>

      {isFocused && (
        <div
          ref={filterRef}
          className="w-[639px] flex flex-col items-center justify-start rounded-[20px] gap-1"
        >
          <div className="w-[607px] h-[1px] bg-shark-200"></div>
          <div className="w-[639px] relative flex flex-col items-center justify-start text-shark-300 text-lg max-h-[200px] overflow-y-auto">
            {searchResults.map((result, index) => {
              const isResultValid = eventTitles.includes(result);
              return (
                <div
                  key={index}
                  className={`w-[635px] h-8 flex justify-center items-start text-shark-300 text-md mt-1 
                  ${
                    isResultValid
                      ? 'hover:bg-shark-50 cursor-pointer'
                      : 'cursor-default'
                  } 
                  rounded-lg transition`}
                  onClick={() => {
                    if (isResultValid) {
                      setInputValue(result);
                      setIsFocused(false);
                    }
                  }}
                >
                  <p className="w-[591px] truncate">{result}</p>
                </div>
              );
            })}
          </div>

          {isFilterOpen && (
            <>
              <div className="w-[583px] font-secondary text-shark-800 font-medium text-md mt-4">
                Filters
              </div>
              <div className="w-[607px] flex flex-wrap justify-start items-center mt-1 gap-x-2 gap-y-1">
                {activeFilterTags.map((tag, index) => (
                  <FilterTag key={index} name={tag} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
