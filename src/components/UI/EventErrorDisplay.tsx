'use client';

import Image from 'next/image';

interface ErrorDisplayProps {
  error: string;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  const isNetworkError =
    error.includes('Network') ||
    error.includes('Unexpected') ||
    error.includes('Invalid');

  return (
    <div className="flex flex-col items-center gap-4 mt-16">
      <Image
        src={isNetworkError ? '/icons/wifi-off.svg' : '/icons/file-x.svg'}
        alt="error icon"
        width={70}
        height={70}
      />
      <p className="text-3xl font-secondary font-normal">
        {isNetworkError ? '500: Network Error' : '404: Event not found'}
      </p>
    </div>
  );
}
