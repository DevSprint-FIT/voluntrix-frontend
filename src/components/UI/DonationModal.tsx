import React from 'react';
import Image from 'next/image';

interface DonationModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DonationModal({ open, setOpen }: DonationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 sm:mx-0 p-6 relative">
        
        {/* Close Button (Optional) */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <Image
          className="mx-auto mt-2"
          src="/icons/heart.svg"
          alt="Heart"
          width={50}
          height={50}
        />

        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900">Make it ongoing!</h3>
          <p className="mt-2 text-sm text-gray-600">
            "Username", your steady support helps us plan ahead
            and we value your every contribution.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => setOpen(false)}
            className="w-full py-2 bg-[#029972] text-white hover:bg-[#04614C] text-sm font-semibold rounded-lg"
          >
            Yes! Let me donate LKR 1,000
          </button>
          <button
            onClick={() => setOpen(false)}
            className="w-full py-2 border-2 border-[#029972] text-[#029972] hover:bg-green-50 text-sm font-semibold rounded-lg"
          >
            No thanks. Complete my own Donation
          </button>
        </div>
      </div>
    </div>
  );
}
