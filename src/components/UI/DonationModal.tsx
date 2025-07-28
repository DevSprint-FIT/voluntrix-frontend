import React from 'react';
import Image from 'next/image';
import {Button} from "@heroui/react";

interface DonationModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DonationModal({ open, setOpen }: DonationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md mx-4 sm:mx-0 p-12 relative">
        
        {/* Close Button (Optional) */}
        <Button
          onPress={() => setOpen(false)}
          className="absolute top-3 right-[-5px] text-gray-500 hover:text-gray-700 bg-transparent text-2xl "
        >
          ✕
        </Button>

        <Image
          className="mx-auto mt-2"
          src="/icons/heart.svg"
          alt="Heart"
          width={50}
          height={50}
        />

        <div className="mt-4 text-center">
          <h3 className="text-[1.4rem] font-semibold text-gray-900 font-primary ">Make it ongoing!</h3>
          <p className="mt-2 text-sm text-gray-600">
            &quot;Username&quot;, your steady support helps us plan ahead
            and we value your every contribution.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <Button 
            onPress={() => setOpen(false)}
            className="w-full py-6 bg-[#029972] text-white text-sm font-semibold rounded-lg"
          >
            Yes! Let me donate LKR 1,000
          </Button>
          <Button
          variant='bordered'
            onPress={() => setOpen(false)}
            className="w-full py-6 border-2 border-[#029972] text-[#029972] text-sm font-semibold rounded-lg"
          >
            No thanks. Complete my own Donation
          </Button>
        </div>
      </div>
    </div>
  );
}