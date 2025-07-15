import { Select, SelectItem } from '@heroui/react';
import { useState, useEffect } from 'react';

interface Props {
  onValidityChange?: (valid: boolean) => void;
}

const eventTypes = [
  { key: 'private', label: 'Private' },
  { key: 'public', label: 'Public' },
];

export default function BasicInfoEC({ onValidityChange }: Props) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDesc] = useState('');
  const [eventType, setEventType] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [time, setTime] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [imageMessage, setImagemessage] = useState('');

  useEffect(() => {
    const valid =
      title.trim() &&
      location.trim() &&
      description.trim() &&
      eventType &&
      startDate &&
      file;
    onValidityChange?.(!!valid);
  }, [
    title,
    location,
    description,
    eventType,
    startDate,
    file,
    onValidityChange,
  ]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
          Event Title*
          <input
            type="text"
            className="border-[2px] border-shark-300 text-shark-950 pl-2 py-1 rounded-lg w-[350px] placeholder:text-shark-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title"
          />
        </label>
        <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
          Event Location*
          <input
            type="text"
            className="border-[2px] border-shark-300 text-shark-950 pl-2 py-1 rounded-lg w-[350px] placeholder:text-shark-300"
            placeholder="Enter event location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
      </div>
      <div className="flex flex-col mt-2">
        <label className="font-secondary font-medium text-shark-950 text-[15px]">
          Event Description*
          <textarea
            value={description}
            onChange={(e) => setDesc(e.target.value)}
            maxLength={150}
            placeholder="Describe your event"
            className="resize-none border-[2px] border-shark-300 text-shark-950 pl-2 pt-1 rounded-lg w-full placeholder:text-shark-300 h-[80px]"
          />
        </label>
        <div className="w-full text-right font-secondary font-normal text-shark-800 text-[11px]">
          {description.length}/150
        </div>
      </div>
      <div className="flex gap-8 mt-2">
        <label className="font-secondary font-medium text-shark-950 text-[15px]">
          Event Type*
          <Select
            placeholder="Select type"
            variant="bordered"
            size="sm"
            value={eventType ?? undefined}
            onChange={(e) => setEventType(e.target.value)}
            className="w-[170px] rounded-2xl text-shark-300 border-shark-300"
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
        <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
          Start Date*
          <input
            type="date"
            className="w-[141px] h-8 border-2 border-shark-300 rounded-lg text-shark-300"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
          End Date
          <input
            type="date"
            className="w-[141px] h-8 border-2 border-shark-300 rounded-lg text-shark-300"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
          Event Time
          <input
            type="time"
            className="px-4 rounded-lg border-[2px] h-8 border-shark-300 text-shark-500 placeholder:text-shark-400 focus:ring-shark-400 focus:border-shark-400"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
      </div>
      <div className="mt-3 font-secondary font-medium text-shark-950 text-[15px]">
        Event Category
      </div>
      <div className="text-[15px] font-secondary text-shark-950 font-normal flex gap-5">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="categories"
            value="environment"
            className="accent-verdant-600"
          />
          Environment
        </label>
        <label className="flex items-center gap-2">
          <input
            className="accent-verdant-600"
            type="checkbox"
            name="categories"
            value="sport"
          />
          Sport
        </label>
        <label className="flex items-center gap-2">
          <input
            className="accent-verdant-600"
            type="checkbox"
            name="categories"
            value="technology"
          />
          Technology
        </label>
        <label className="flex items-center gap-2">
          <input
            className="accent-verdant-600"
            type="checkbox"
            name="categories"
            value="charity"
          />
          Charity
        </label>
        <label className="flex items-center gap-2">
          <input
            className="accent-verdant-600"
            type="checkbox"
            name="categories"
            value="education"
          />
          Education
        </label>
      </div>
      <label className="mt-3 flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
        Upload Event Image* (Maximum image size is 100 MB)
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            const maxSize = 100 * 1024 * 1024; // 100 MB

            if (file) {
              if (file.size > maxSize) {
                setImagemessage(
                  'File size exceeds 100 MB. Please upload a smaller image.'
                );
                e.target.value = '';
                setFile(null);
              } else {
                setImagemessage('');
                setFile(file);
              }
            }
          }}
          className="mt-1 file:text-[15px] text-[14px] text-shark-950 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:font-medium file:text-shark-950 file:border-0 file:bg-shark-200"
        />
        {imageMessage && (
          <div className="mt-1 text-red-600 text-[13px] font-secondary font-normal">{imageMessage}</div>
        )}
      </label>
    </div>
  );
}
