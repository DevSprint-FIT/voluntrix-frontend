import { useState, useEffect } from 'react';
import ChatListInterface from './ChatListInterface';
import PrivateChatInterface from './PrivateChatInterface';

type ChatState = 'login' | 'chatList' | 'privateChat';

export default function ChatController() {
  const [chatState, setChatState] = useState<ChatState>('login');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [usernameInput, setUsernameInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    
    const username = usernameInput.trim();
    if (!username) {
      setLoginError('Please enter your username');
      return;
    }

    setCurrentUser(username);
    setIsAnimating(true);
    
    // Trigger animation and then change state
    setTimeout(() => {
      setChatState('chatList');
      setIsAnimating(false);
    }, 100);
    
    setLoginError('');
  };

  const handleSelectUser = (otherUser: string) => {
    setSelectedUser(otherUser);
    setIsAnimating(true);
    
    setTimeout(() => {
      setChatState('privateChat');
      setIsAnimating(false);
    }, 100);
  };

  const handleBackToList = () => {
    setIsAnimating(true);
    
    setTimeout(() => {
      setChatState('chatList');
      setSelectedUser('');
      setIsAnimating(false);
    }, 100);
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
      <div className="min-h-screen bg-black flex">
        {/* Left side - Main content/branding */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-lg text-center">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to Voluntrix Chat
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Connect with sponsors and volunteers in real-time. Start meaningful conversations that make a difference.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center space-x-2 text-gray-300">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-300">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Real-time</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-300">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                <span>Community</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-96 bg-white shadow-xl flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">
                Get Started
              </h2>
              <p className="text-sm text-gray-600">
                Enter your username to continue
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-black mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                className="w-full py-3 px-4 rounded-lg transition-all bg-green-500 text-white hover:bg-green-600 font-medium hover:shadow-lg transform hover:scale-105"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Chat List Screen
  if (chatState === 'chatList') {
    return (
      <div className="min-h-screen bg-black flex">
        {/* Left side - Branding/Background */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a3 3 0 01-3-3V9a3 3 0 013-3h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Welcome {currentUser}!</h2>
            <p className="text-gray-300 max-w-md">
              Select a conversation from the chat list to start messaging. Connect with sponsors and volunteers to make a positive impact together.
            </p>
          </div>
        </div>

        {/* Right side - Chat List with slide-in animation */}
        <div className={`w-96 bg-white shadow-xl transform transition-transform duration-500 ease-out ${
          isAnimating ? 'translate-x-full' : 'translate-x-0'
        }`}>
          <ChatListInterface 
            currentUser={currentUser}
            onSelectUser={handleSelectUser}
            onLogout={handleLogout}
          />
        </div>
      </div>
    );
  }

  // Private Chat Screen
  if (chatState === 'privateChat') {
    return (
      <div className="min-h-screen bg-black flex">
        {/* Left side - Branding/Background */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Private Chat</h3>
            <p className="text-gray-300">
              You're chatting with <span className="font-semibold text-green-400">{selectedUser}</span>
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Your conversation is private and secure
            </p>
          </div>
        </div>

        {/* Right side - Private Chat with slide-in animation */}
        <div className={`w-96 bg-white shadow-xl transform transition-transform duration-500 ease-out ${
          isAnimating ? 'translate-x-full' : 'translate-x-0'
        }`}>
          <PrivateChatInterface 
            initialUser={currentUser}
            initialOtherUser={selectedUser}
            onBack={handleBackToList}
          />
        </div>
      </div>
    );
  }

  return null;
}
