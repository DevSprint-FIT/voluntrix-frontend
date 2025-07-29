'use client';

import dynamic from 'next/dynamic';

// Dynamically import the ChatController component with SSR disabled
const ChatController = dynamic(() => import('./ChatController'), { ssr: false });

export default function ChatPage() {
  // Define a dummy setShowChat function since this is the main chat page
  const setShowChat = (show: boolean) => {
    // In the main chat page, we can handle this differently
    // For now, we can just log it or handle navigation
    console.log('Chat visibility:', show);
    if (!show) {
      // Optionally redirect or handle closing the chat
      window.history.back();
    }
  };

  return <ChatController setShowChat={setShowChat} />;
}