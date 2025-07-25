'use client';

import { EventCreateType } from '@/types/EventCreateType';
import { Button, Switch } from '@heroui/react';
import Image from 'next/image';
import { useState } from 'react';

export type Tier = {
  id: string;
  name: string;
  amount: number;
};

interface Props {
  data: EventCreateType;
  onChange: (changes: Partial<EventCreateType>) => void;
  tiers: Tier[];
  setTiers: React.Dispatch<React.SetStateAction<Tier[]>>;
}

const formatRs = (n: number) =>
  `Rs. ${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function SponsorshipsEC({
  data,
  onChange,
  tiers,
  setTiers,
}: Props) {
  const [tierName, setTierName] = useState('');
  const [tierAmount, setTierAmount] = useState('');

  const addTier = () => {
    const amt = Number(tierAmount);
    if (!tierName.trim() || !amt) return;
    setTiers((t) => [
      ...t,
      { id: crypto.randomUUID(), name: tierName.trim(), amount: amt },
    ]);
    setTierName('');
    setTierAmount('');
  };

  const removeTier = (id: string) =>
    setTiers((t) => t.filter((tier) => tier.id !== id));

  const [donInput, setDonInput] = useState('');
  const [donGoal, setDonGoal] = useState<number | null>(null);

  const setGoal = () => {
    const amt = Number(donInput);
    if (!amt) return;
    setDonGoal(amt);
    setDonInput('');
  };

  const [proposalMessage, setProposalmessage] = useState('');
  const [file, setFile] = useState<File | null>(null);

  return (
    <>
      <div className="mt-2 flex gap-4 font-primary font-medium text-shark-950 text-[20px]">
        Sponsorships
        <Switch
          isSelected={data.sponsorshipEnabled}
          onValueChange={(val) => onChange({ sponsorshipEnabled: val })}
          color="success"
          size="sm"
        />
      </div>
      <fieldset
        disabled={!data.sponsorshipEnabled}
        className={
          !data.sponsorshipEnabled ? 'opacity-50 pointer-events-none' : ''
        }
      >
        <div className="flex gap-4 mb-1">
          <label className="flex flex-col font-secondary font-medium text-[15px]">
            Sponsorship
            <input
              type="text"
              value={tierName}
              onChange={(e) => setTierName(e.target.value)}
              placeholder="Enter sponsorship name"
              className="border-[2px] border-shark-300 pl-2 py-1 rounded-lg w-[300px]"
            />
          </label>

          <label className="flex flex-col font-secondary font-medium text-[15px]">
            Amount
            <div className="flex gap-4">
              <input
                type="number"
                min="1"
                value={tierAmount}
                onChange={(e) => setTierAmount(e.target.value)}
                placeholder="Enter amount"
                className="border-[2px] border-shark-300 text-shark-950 pl-2 py-1 rounded-lg w-[200px] placeholder:text-shark-300"
              />

              <Button
                variant="shadow"
                isDisabled={!tierName.trim() || !Number(tierAmount)}
                className="bg-verdant-600 text-white px-6 py-2 rounded-lg h-9"
                onPress={addTier}
              >
                Add
              </Button>
            </div>
          </label>
        </div>
        {tiers.length > 0 && (
          <div className="mb-4">
            <h4 className="font-secondary font-medium text-shark-950 text-[16px] mb-1">
              Sponsorship Tiers:
            </h4>
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="flex items-center gap-3 font-secondary font-medium text-[16px] mb-1"
              >
                <p className="text-shark-950">{tier.name}</p>
                <p className="text-shark-800">{formatRs(tier.amount)}</p>
                <Image
                  src="/icons/close.svg"
                  width={12}
                  height={12}
                  alt="remove"
                  className="cursor-pointer hover:opacity-70"
                  onClick={() => removeTier(tier.id)}
                />
              </div>
            ))}
          </div>
        )}

        <label className="mt-3 flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
          Upload Sponsorship Proposal (Maximum file size is 100 MB)
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              const maxSize = 100 * 1024 * 1024; // 100 MB

              if (file) {
                if (file.size > maxSize) {
                  setProposalmessage(
                    'File size exceeds 100 MB. Please upload a smaller file.'
                  );
                  e.target.value = '';
                  setFile(null);
                } else {
                  setProposalmessage('');
                  setFile(file);
                }
              }
            }}
            className="mt-1 file:text-[15px] text-[14px] text-shark-950 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:font-medium file:text-shark-950 file:border-0 file:bg-shark-200"
          />
          {proposalMessage && (
            <div className="mt-1 text-red-600 text-[13px] font-secondary font-normal">
              {proposalMessage}
            </div>
          )}
          {file && (
            <div className="mt-1 text-green-600 text-[13px] font-secondary font-normal">
              Selected file: {file.name}
            </div>
          )}
        </label>
      </fieldset>
      <div className="mt-4 flex gap-4 items-center font-primary font-medium text-shark-950 text-[20px]">
        Donations
        <Switch
          isSelected={data.donationEnabled}
          onValueChange={(val) => onChange({ donationEnabled: val })}
          color="success"
          size="sm"
        />
      </div>
      {data.donationEnabled && (
        <>
          <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
            Amount
            <div className="flex gap-4">
              <input
                type="number"
                min="1"
                value={donInput}
                onChange={(e) => setDonInput(e.target.value)}
                className="border-[2px] border-shark-300 text-shark-950 pl-2 py-1 rounded-lg w-[200px] placeholder:text-shark-300"
                placeholder="Enter donation goal"
              />
              <Button
                variant="shadow"
                isDisabled={!Number(donInput)}
                className="bg-verdant-600 text-white text-[15px] font-primary px-6 py-2 rounded-lg tracking-[1px] h-9"
                onPress={setGoal}
              >
                Add
              </Button>
            </div>
          </label>
          {donGoal !== null && (
            <div className="flex items-center gap-2 font-secondary font-medium text-[16px]">
              <p className="text-shark-950">Donation goal is set to</p>
              <p className="text-shark-800">{formatRs(donGoal)}</p>
              <Image
                src="/icons/close.svg"
                width={12}
                height={12}
                alt="remove-goal"
                className="cursor-pointer"
                onClick={() => setDonGoal(null)}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
