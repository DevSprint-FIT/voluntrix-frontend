import { uploadToCloudinary } from '@/services/ImageUploadService';
import { EventCreateData } from '@/types/EventCreateData';
import { Select, SelectItem } from '@heroui/react';
import { useState, useEffect } from 'react';

interface Props {
  data: EventCreateData;
  onChange: (changes: Partial<EventCreateData>) => void;
  onValidityChange: (valid: boolean) => void;
}

const eventTypes = [
  { key: 'ONLINE', label: 'Online' },
  { key: 'ONSITE', label: 'Onsite' },
];

const eventVisibilities = [
  { key: 'PRIVATE', label: 'Private' },
  { key: 'PUBLIC', label: 'Public' },
];

const categories = [
  { categoryId: 1, categoryName: 'environment' },
  { categoryId: 2, categoryName: 'sports' },
  { categoryId: 3, categoryName: 'technology' },
  { categoryId: 4, categoryName: 'charity' },
  { categoryId: 5, categoryName: 'education' },
];

export default function BasicInfoEC({
  data,
  onChange,
  onValidityChange,
}: Props) {
  const [imageMessage, setImageMessage] = useState('');
  const [dateWarning, setDateWarning] = useState('');

  useEffect(() => {
    const valid =
      data.eventTitle.trim() &&
      data.eventLocation.trim() &&
      data.eventDescription.trim() &&
      data.eventType &&
      data.eventVisibility &&
      data.eventStartDate &&
      data.eventEndDate &&
      data.eventTime &&
      data.eventImageUrl &&
      data.categories.length > 0 &&
      data.eventStartDate <= data.eventEndDate;

    if (
      data.eventStartDate &&
      data.eventEndDate &&
      data.eventStartDate > data.eventEndDate
    ) {
      setDateWarning('End date should not be before start date.');
    } else {
      setDateWarning('');
    }

    onValidityChange(!!valid);
  }, [data, onValidityChange, setDateWarning]);

  const handleCategoryChange = (
    category: { categoryId: number; categoryName: string },
    checked: boolean
  ) => {
    const newCategories = checked
      ? [...data.categories, category]
      : data.categories.filter((cat) => cat.categoryId !== category.categoryId);
    onChange({ categories: newCategories });
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
          Event Title
          <input
            type="text"
            className="border-[2px] border-shark-300 text-shark-950 pl-2 py-1 rounded-lg w-[350px] placeholder:text-shark-300"
            value={data.eventTitle}
            onChange={(e) => onChange({ eventTitle: e.target.value })}
            placeholder="Enter event title"
          />
        </label>
        <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
          Event Location
          <input
            type="text"
            className="border-[2px] border-shark-300 text-shark-950 pl-2 py-1 rounded-lg w-[350px] placeholder:text-shark-300"
            placeholder="Enter event location"
            value={data.eventLocation}
            onChange={(e) => onChange({ eventLocation: e.target.value })}
          />
        </label>
      </div>
      <div className="flex flex-col mt-2">
        <label className="font-secondary font-medium text-shark-950 text-[15px]">
          Event Description
          <textarea
            value={data.eventDescription}
            onChange={(e) => onChange({ eventDescription: e.target.value })}
            maxLength={150}
            placeholder="Describe your event"
            className="resize-none border-[2px] border-shark-300 text-shark-950 pl-2 pt-1 rounded-lg w-full placeholder:text-shark-300 h-[80px]"
          />
        </label>
        <div className="w-full text-right font-secondary font-normal text-shark-800 text-[11px]">
          {data.eventDescription.length}/150
        </div>
      </div>
      <div className="flex gap-8 mt-2">
        <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
          Start Date
          <input
            type="date"
            className="w-[141px] h-8 border-2 border-shark-300 rounded-lg text-shark-300"
            value={data.eventStartDate}
            onChange={(e) => onChange({ eventStartDate: e.target.value })}
          />
        </label>
        <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
          End Date
          <input
            type="date"
            className="w-[141px] h-8 border-2 border-shark-300 rounded-lg text-shark-300"
            value={data.eventEndDate}
            onChange={(e) => onChange({ eventEndDate: e.target.value })}
          />
        </label>
        <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
          Event Time
          <input
            type="time"
            className="px-4 rounded-lg border-[2px] h-8 border-shark-300 text-shark-500 placeholder:text-shark-400 focus:ring-shark-400 focus:border-shark-400"
            value={data.eventTime}
            onChange={(e) => onChange({ eventTime: e.target.value })}
          />
        </label>
        <label className="font-secondary font-medium text-shark-950 text-[15px]">
          Event Visibility
          <Select
            placeholder="Select type"
            variant="bordered"
            size="sm"
            value={data.eventVisibility || ''}
            onChange={(e) => onChange({ eventVisibility: e.target.value })}
            className="w-[120px] rounded-2xl text-shark-300 border-shark-300"
            classNames={{
              base: 'border-shark-300',
              trigger: 'border-shark-300',
            }}
          >
            {eventVisibilities.map((t) => (
              <SelectItem
                key={t.key}
                value={t.key}
                className="font-medium text-shark-800 font-secondary text-[15px]"
              >
                {t.label}
              </SelectItem>
            ))}
          </Select>
        </label>
        <label className="font-secondary font-medium text-shark-950 text-[15px]">
          Event Type
          <Select
            placeholder="Select type"
            variant="bordered"
            size="sm"
            value={data.eventType || ''}
            onChange={(e) => onChange({ eventType: e.target.value })}
            className="w-[120px] rounded-2xl text-shark-300 border-shark-300"
            classNames={{
              base: 'border-shark-300',
              trigger: 'border-shark-300',
            }}
          >
            {eventTypes.map((t) => (
              <SelectItem
                key={t.key}
                value={t.key}
                className="font-medium text-shark-800 font-secondary text-[15px]"
              >
                {t.label}
              </SelectItem>
            ))}
          </Select>
        </label>
      </div>
      {dateWarning && (
        <div className="text-[13px] text-red-600 mt-1 font- font-secondary">
          {dateWarning}
        </div>
      )}
      <div className="mt-3 font-secondary font-medium text-shark-950 text-[15px]">
        Event Category
      </div>
      <div className="text-[15px] font-secondary text-shark-950 font-normal flex gap-5">
        {categories.map((category) => (
          <label key={category.categoryId} className="flex items-center gap-2">
            <input
              type="checkbox"
              value={category.categoryId}
              className="accent-verdant-600"
              checked={data.categories.some(
                (cat) => cat.categoryId === category.categoryId
              )}
              onChange={(e) => handleCategoryChange(category, e.target.checked)}
            />
            {category.categoryName.charAt(0).toUpperCase() +
              category.categoryName.slice(1)}
          </label>
        ))}
      </div>
      <label className="mt-3 flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
        Upload Event Image (Maximum image size is 100 MB)
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            const maxSize = 100 * 1024 * 1024;

            if (file) {
              if (file.size > maxSize) {
                setImageMessage(
                  'File size exceeds 100 MB. Please upload a smaller image.'
                );
              } else {
                setImageMessage('Uploading...');
                try {
                  const uploadedUrl = await uploadToCloudinary(file);
                  onChange({ eventImageUrl: uploadedUrl });
                  setImageMessage('Image uploaded successfully.');
                } catch {
                  setImageMessage('Upload failed. Please try again.');
                }
              }
            }
          }}
          className="mt-1 file:text-[15px] text-[14px] text-shark-950 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:font-medium file:text-shark-950 file:border-0 file:bg-shark-200"
        />
        {imageMessage && (
          <div className="mt-1 text-shark-600 text-[13px] font-secondary font-normal">
            {imageMessage}
          </div>
        )}
      </label>
    </div>
  );
}
