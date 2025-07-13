import { Button, Switch } from '@heroui/react';
import Image from 'next/image';
import { useState } from 'react';

export default function SponsorshipsEC() {
  const [isDonationEnabled, setIsDonationEnabled] = useState(false);

  return (
    <>
      <div className="mt-2 font-primary font-medium text-shark-950 text-[20px]">
        Sponsorships
      </div>
      <div className="flex items-center gap-8 font-secondary font-medium text-shark-950 text-[16px]">
        <p>Gold Partner</p>
        <p>Rs. 150, 000</p>
        <div className="cursor-pointer">
          <Image src={'/icons/close.svg'} width={12} height={12} alt="close" />
        </div>
      </div>
      <div className="flex gap-4">
        <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
          Sponsorship
          <input
            type="text"
            className="border-[2px] border-shark-300 text-shark-950 pl-2 py-1 rounded-lg w-[300px] placeholder:text-shark-300"
          />
        </label>
        <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
          Amount
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Enter amount"
              className="border-[2px] border-shark-300 text-shark-950 pl-2 py-1 rounded-lg w-[200px] placeholder:text-shark-300"
            />
            <Button
              variant="shadow"
              // disabled={!isFormValid}
              className="bg-verdant-600 text-white text-[15px] font-primary px-6 py-2 rounded-lg tracking-[1px] h-9"
              onPress={() => {
                // if (!isFormValid) return;
                // 👉 TODO: send data to your API here
                // await fetch(...)
                // setArea(null);
                // setReason('');
                // setIsAgree(false);
                // onClose();
                // openSuccessModal();
              }}
            >
              Add
            </Button>
          </div>
        </label>
      </div>
      <div className="mt-2 font-primary font-medium text-shark-950 text-[20px]">
        Donations
      </div>
      <label className="flex gap-4 items-center font-secondary font-medium text-shark-950 text-[15px]">
        Enable donations
        <Switch
          isSelected={isDonationEnabled}
          onValueChange={setIsDonationEnabled}
          defaultSelected
          color="success"
          size="sm"
        />
      </label>
      {isDonationEnabled && (
        <div>
          <label className="flex flex-col font-secondary font-medium text-shark-950 text-[15px]">
            Amount
            <div className="flex gap-4">
              <input
                type="text"
                className="border-[2px] border-shark-300 text-shark-950 pl-2 py-1 rounded-lg w-[200px] placeholder:text-shark-300"
              />
              <Button
                variant="shadow"
                className="bg-verdant-600 text-white text-[15px] font-primary px-6 py-2 rounded-lg tracking-[1px] h-9"
              >
                Add
              </Button>
            </div>
          </label>
          <div className="flex mt-4 items-center gap-2 font-secondary font-medium text-shark-950 text-[16px]">
            <p>Donation goal is set to</p>
            <p>Rs.150, 000</p>
            <div className="ml-4 cursor-pointer">
              <Image
                src={'/icons/close.svg'}
                width={12}
                height={12}
                alt="close"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
