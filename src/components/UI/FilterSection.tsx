'use client';

import { useState } from 'react';
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

export default function FilterSection() {
  const [isFilterTabOpen, setIsFilterTabOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const toggleFilter = () => setIsFilterTabOpen((prev) => !prev);

  return (
    <div className="relative w-[143px] h-[56px] flex flex-col gap-8 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[40px] bg-transparent">
      <Button
        variant="shadow"
        className="flex gap-3 w-[143px] h-[56px] bg-verdant-50 text-shark-95 rounded-[40px]"
        onPress={toggleFilter}
      >
        <Image src="/icons/filter.svg" width={24} height={24} alt="Filter" />
        <p className="text-shark-950 text-lg font-secondary">Filters</p>
      </Button>

      {isFilterTabOpen && (
        <div className="absolute w-[340px] flex justify-center items-center bg-white border-2 rounded-[20px] border-shark-200 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-20 z-10 py-7">
          <div className="w-[297px] flex flex-col gap-6">
            <div className="w-[297px] flex flex-col gap-3">
              <p className="font-secondary text-shark-900 font-medium text-lg">
                Date Range
              </p>
              <div className="w-[297px] flex gap-3">
                <div className="flex flex-col justify-center items-start">
                  <p className="text-sm text-shark-600 font-medium">
                    Start Date
                  </p>
                  <input
                    type="date"
                    className="w-[141px] h-8 border-2 border-shark-300 rounded-lg"
                  />
                </div>
                <div className="flex flex-col justify-center items-start">
                  <p className="text-sm text-shark-600 font-medium">End Date</p>
                  <input
                    type="date"
                    className="w-[141px] h-8 border-2 border-shark-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="w-[297px] flex flex-col gap-3">
              <p className="font-secondary text-shark-900 font-medium text-lg">
                Location
              </p>
              <div className="w-[297px] flex gap-3">
                <div className="flex flex-col justify-center items-start">
                  <p className="text-sm text-shark-600 font-medium">Province</p>
                  <SelectField
                    options={provinces}
                    value={selectedProvince}
                    onChange={setSelectedProvince}
                  />
                </div>
                <div className="flex flex-col justify-center items-start">
                  <p className="text-sm text-shark-600 font-medium">District</p>
                  <SelectField
                    options={districtsByProvince[selectedProvince] || []}
                    value={selectedDistrict}
                    onChange={setSelectedDistrict}
                    disabled={!selectedProvince}
                  />
                </div>
              </div>
            </div>

            <div className="w-[297px] flex flex-col gap-3">
              <p className="font-secondary text-shark-900 font-medium text-lg">
                Category
              </p>
              <div className="w-[297px] flex flex-wrap gap-3">
                <div className="h-[40px] border-2 border-shark-300 flex items-center justify-center font-secondary text-shark-950 rounded-[20px] cursor-pointer">
                  <p className="text-sm m-4">Environment</p>
                </div>
              </div>
            </div>

            <div className="w-[297px] flex flex-col gap-3">
              <p className="font-secondary text-shark-900 font-medium text-lg">
                Participation Type
              </p>
              <div className="w-[297px] flex flex-wrap gap-7">
                <div className="flex gap-3">
                  <p className="text-[16px] font-medium font-secondary text-shark-600">
                    Private
                  </p>
                  <Switch defaultSelected size="sm" color="default"></Switch>
                </div>
                <div className="flex gap-3">
                  <p className="text-[16px] font-medium font-secondary text-shark-600">
                    Public
                  </p>
                  <Switch defaultSelected size="sm" color="default"></Switch>
                </div>
              </div>
            </div>

            <div className="w-[297px] flex justify-end gap-3">
              <Button
                variant="shadow"
                className="w-[78px] h-[32px] text-[16px] font-secondary bg-shark-50 text-shark-950 rounded-[20px]"
              >
                Clear
              </Button>
              <Button
                variant="shadow"
                className="w-[78px] h-[32px] text-[16px] font-secondary bg-shark-950 text-shark-50 rounded-[20px]"
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
