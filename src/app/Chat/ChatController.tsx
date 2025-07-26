import { useState } from 'react';
import ChatListInterface from './ChatListInterface';
import PrivateChatInterface from './PrivateChatInterface';

type ChatState = 'login' | 'chatList' | 'privateChat';

export default function ChatController() {
  const [chatState, setChatState] = useState<ChatState>('login');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [usernameInput, setUsernameInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    
    const username = usernameInput.trim();
    if (!username) {
      setLoginError('Please enter your username');
      return;
    }

    setCurrentUser(username);
    setChatState('chatList');
    setLoginError('');
  };

  const handleSelectUser = (otherUser: string) => {
    setSelectedUser(otherUser);
    setChatState('privateChat');
  };

  const handleBackToList = () => {
    setChatState('chatList');
    setSelectedUser('');
  };

  const handleLogout = () => {
    setChatState('login');
    setCurrentUser('');
    setSelectedUser('');
    setUsernameInput('');
  };

  // Login Screen
  if (chatState === 'login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome to Chat
            </h1>
            <p className="text-sm text-gray-600">
              Enter your username to continue
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>
            
            {loginError && (
              <div className="p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg transition-colors bg-green-500 text-white hover:bg-green-600 font-medium"
            >
              Continue
            </button>
          </form>
          
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure & Private</span>
              </div>
              <p>Your conversations are encrypted and secure</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat List Screen
  if (chatState === 'chatList') {
    return (
      <ChatListInterface 
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        onLogout={handleLogout}
      />
    );
  }

  // Private Chat Screen
  if (chatState === 'privateChat') {
    return (
      <PrivateChatInterface 
        initialUser={currentUser}
        initialOtherUser={selectedUser}
        onBack={handleBackToList}
      />
    );
  }

  return null;
}
