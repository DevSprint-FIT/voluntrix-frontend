'use client';

import { useState, useEffect, useRef } from 'react';
import { Button, Switch } from '@heroui/react';
import Image from 'next/image';
import SelectField from './SelectField';

const provinces = [
  { key: 'western', label: 'Western' },
  { key: 'central', label: 'Central' },
  { key: 'southern', label: 'Southern' },
  { key: 'northern', label: 'Northern' },
  { key: 'eastern', label: 'Eastern' },
  { key: 'north_western', label: 'North Western' },
  { key: 'north_central', label: 'North Central' },
  { key: 'uva', label: 'Uva' },
  { key: 'sabaragamuwa', label: 'Sabaragamuwa' },
];

const districtsByProvince = {
  western: ['Colombo', 'Gampaha', 'Kalutara'],
  central: ['Kandy', 'Matale', 'Nuwara Eliya'],
  southern: ['Galle', 'Matara', 'Hambantota'],
  northern: ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu'],
  eastern: ['Batticaloa', 'Ampara', 'Trincomalee'],
  north_western: ['Kurunegala', 'Puttalam'],
  north_central: ['Anuradhapura', 'Polonnaruwa'],
  uva: ['Badulla', 'Monaragala'],
  sabaragamuwa: ['Ratnapura', 'Kegalle'],
};

const categories = [
  'Environment',
  'Sport',
  'Technology',
  'Charity',
  'Education',
];

export default function FilterSection() {
  const [isFilterTabOpen, setIsFilterTabOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    province: '',
    district: '',
    categories: [] as string[],
    privateSelected: false,
    publicSelected: false,
  });

  const toggleFilter = () => setIsFilterTabOpen((prev) => !prev);

  const handleCategoryToggle = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((item) => item !== category)
        : [...prev.categories, category],
    }));
  };

  const handleApplyFilters = () => {
    console.log('Applied Filters:', filters);
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      province: '',
      district: '',
      categories: [],
      privateSelected: false,
      publicSelected: false,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterTabOpen(false);
      }
    };

    if (isFilterTabOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterTabOpen]);

  return (
    <div className="relative w-[143px] flex flex-col gap-8 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[40px] bg-transparent">
      <Button
        variant="shadow"
        className="flex gap-3 w-[143px] h-[52px] bg-verdant-50 text-shark-95 rounded-[40px]"
        onPress={toggleFilter}
      >
        <Image src="/icons/filter.svg" width={24} height={24} alt="Filter" />
        <p className="text-shark-950 text-lg font-secondary">Filters</p>
      </Button>

      {/* Filter tab */}
      {isFilterTabOpen && (
        <div
          ref={filterRef}
          className="absolute w-[340px] flex justify-center items-center bg-white border-2 rounded-[20px] border-shark-200 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[74px] z-10 py-5"
        >
          <div className="w-[297px] flex flex-col gap-4">
            {/* Date */}
            <div className="w-[297px] flex flex-col gap-1">
              <p className="font-secondary text-shark-900 font-medium text-md">
                Date Range
              </p>
              <div className="w-[297px] flex gap-3">
                <div className="flex flex-col justify-center items-start">
                  <p className="text-sm text-shark-600 font-medium">
                    Start Date
                  </p>
                  <input
                    type="date"
                    className="w-[141px] h-8 border-2 border-shark-300 rounded-md"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col justify-center items-start">
                  <p className="text-sm text-shark-600 font-medium">End Date</p>
                  <input
                    type="date"
                    className="w-[141px] h-8 border-2 border-shark-300 rounded-md"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="w-[297px] flex flex-col gap-1">
              <p className="font-secondary text-shark-900 font-medium text-md">
                Location
              </p>
              <div className="w-[297px] flex gap-3">
                <div className="flex flex-col justify-center items-start">
                  <p className="text-sm text-shark-600 font-medium">Province</p>
                  <SelectField
                    options={provinces}
                    value={filters.province}
                    onChange={(value) =>
                      setFilters((prev) => ({ ...prev, province: value }))
                    }
                  />
                </div>
                <div className="flex flex-col justify-center items-start">
                  <p className="text-sm text-shark-600 font-medium">District</p>
                  <SelectField
                    options={
                      filters.province
                        ? districtsByProvince[
                            filters.province as keyof typeof districtsByProvince
                          ].map((district) => ({
                            key: district,
                            label: district,
                          }))
                        : []
                    }
                    value={filters.district}
                    onChange={(value) =>
                      setFilters((prev) => ({ ...prev, district: value }))
                    }
                    disabled={!filters.province}
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="w-[297px] flex flex-col gap-1">
              <p className="font-secondary text-shark-900 font-medium text-md">
                Category
              </p>
              <div className="w-[297px] flex flex-wrap gap-x-1 gap-y-3 font-medium text-sm text-shark-600 font-secondary">
                {categories.map((category) => (
                  <div
                    key={category}
                    className={`py-1 px-2 border-2 rounded-[20px] cursor-pointer transition-all 
                      ${
                        filters.categories.includes(category)
                          ? 'border-shark-950 text-shark-950'
                          : 'border-shark-300'
                      }`}
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>

            {/* Participation */}
            <div className="w-[297px] flex flex-col gap-1">
              <p className="font-secondary text-shark-900 font-medium text-md">
                Participation Type
              </p>
              <div className="w-[297px] flex flex-wrap gap-7">
                <div className="flex gap-3">
                  <p className="text-sm font-medium font-secondary text-shark-600">
                    Private
                  </p>
                  <Switch
                    color="default"
                    checked={filters.privateSelected}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        privateSelected: !prev.privateSelected,
                      }))
                    }
                    size="sm"
                  />
                </div>

                <div className="flex gap-3 justify-center">
                  <p className="text-sm font-medium font-secondary text-shark-600">
                    Public
                  </p>
                  <Switch
                    color="default"
                    checked={filters.publicSelected}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        publicSelected: !prev.publicSelected,
                      }))
                    }
                    size="sm"
                    className={`${
                      filters.publicSelected ? 'bg-shark-950' : 'bg-gray-300'
                    } rounded-full`}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-[297px] flex justify-end gap-3">
              <Button
                variant="shadow"
                className="w-[78px] h-[32px] text-[16px] font-secondary bg-shark-50 text-shark-950 rounded-[20px]"
                onPress={handleClearFilters}
              >
                Clear
              </Button>
              <Button
                variant="shadow"
                className="w-[78px] h-[32px] text-[16px] font-secondary bg-shark-950 text-shark-50 rounded-[20px]"
                onPress={handleApplyFilters}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
