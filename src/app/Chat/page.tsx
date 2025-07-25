'use client';

import dynamic from 'next/dynamic';

// Dynamically import the PrivateChatInterface component with SSR disabled
const PrivateChatInterface = dynamic(() => import('./PrivateChatInterface'), { ssr: false });

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <PrivateChatInterface />
    </div>
  );
}
