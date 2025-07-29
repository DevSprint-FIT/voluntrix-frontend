'use client';

import dynamic from 'next/dynamic';

// Dynamically import the ChatController component with SSR disabled
const ChatController = dynamic(() => import('./ChatController'), { ssr: false });

export default function ChatPage() {
  return <ChatController setShowChat={setShowChat} />;
}