import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp, CompatClient } from '@stomp/stompjs';

interface StompFrame {
  body: string;
}

interface ChatUser {
  username: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

interface Sponsor {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  companyName: string;
  bio: string;
  isActive: boolean;
  isOnline: boolean;
}

type TabType = 'conversations' | 'sponsors';

interface ChatListProps {
  currentUser: string;
  onSelectUser: (otherUser: string) => void;
  onLogout: () => void;
  setShowChat: (show: boolean) => void;
}

export default function ChatListInterface({
  currentUser,
  onSelectUser,
  onLogout,
  setShowChat,
}: ChatListProps) {
  const [availableUsers, setAvailableUsers] = useState<ChatUser[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('conversations');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddChat, setShowAddChat] = useState(false);
  const [newChatUser, setNewChatUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch available users and recent chats from backend
  const fetchUsersAndChats = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError('');

    try {
      // Fetch recent conversations for the current user
      const conversationsResponse = await fetch(
        `http://localhost:8080/api/private-chat/conversations/${encodeURIComponent(
          currentUser
        )}`
      );

      let recentChats: ChatUser[] = [];
      if (conversationsResponse.ok) {
        const conversations = await conversationsResponse.json();

        // Transform conversations to ChatUser format and store raw timestamp for sorting
        const transformedChats = conversations.map((conv: any) => {
          const otherUser =
            conv.user1 === currentUser ? conv.user2 : conv.user1;
          const rawTimestamp = conv.lastMessage?.timestamp;
          return {
            username: otherUser,
            lastMessage: conv.lastMessage?.content || 'No messages yet',
            timestamp: rawTimestamp ? formatRelativeTime(rawTimestamp) : '',
            unreadCount: conv.unreadCount || 0,
            isOnline: Math.random() > 0.5, // TODO: Implement real online status
            rawTimestamp: rawTimestamp, // Keep raw timestamp for sorting
          };
        });

        // Sort by timestamp (most recent first)
        transformedChats.sort((a: any, b: any) => {
          if (!a.rawTimestamp && !b.rawTimestamp) return 0;
          if (!a.rawTimestamp) return 1;
          if (!b.rawTimestamp) return -1;

          const dateA = new Date(a.rawTimestamp);
          const dateB = new Date(b.rawTimestamp);
          return dateB.getTime() - dateA.getTime(); // DESC order (most recent first)
        });

        // Remove rawTimestamp before setting state
        recentChats = transformedChats.map(
          ({ rawTimestamp, ...chat }: any) => chat
        );
      }

      // If no recent chats, show some default available users
      if (recentChats.length === 0) {
        const defaultUsers: ChatUser[] = [
          {
            username: 'Harindu Hadithya',
            lastMessage: 'Available for new conversations',
            timestamp: 'Online',
            unreadCount: 0,
            isOnline: true,
          },
          {
            username: 'Alice Johnson',
            lastMessage: 'Ready to help with volunteering',
            timestamp: 'Online',
            unreadCount: 0,
            isOnline: true,
          },
          {
            username: 'Bob Smith',
            lastMessage: 'Looking for sponsors',
            timestamp: 'Online',
            unreadCount: 0,
            isOnline: true,
          },
          {
            username: 'Carol White',
            lastMessage: 'Community organizer',
            timestamp: 'Online',
            unreadCount: 0,
            isOnline: false,
          },
        ];

        // Filter out current user from default users
        recentChats = defaultUsers.filter(
          (user) => user.username !== currentUser
        );
      }

      setAvailableUsers(recentChats);

      // Fetch sponsors
      const sponsorsResponse = await fetch(
        'http://localhost:8080/api/private-chat/sponsors'
      );
      if (sponsorsResponse.ok) {
        const sponsorsData = await sponsorsResponse.json();
        setSponsors(sponsorsData);
      }
    } catch (error) {
      console.error('Error fetching users and chats:', error);
      setError('Failed to load conversations');

      // Fallback to default users on error
      const fallbackUsers: ChatUser[] = [
        {
          username: 'Harindu Hadithya',
          lastMessage: 'Available for conversations',
          timestamp: 'Online',
          unreadCount: 0,
          isOnline: true,
        },
      ].filter((user) => user.username !== currentUser);

      setAvailableUsers(fallbackUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndChats();
  }, [currentUser]);

  // Setup WebSocket connection for real-time updates
  useEffect(() => {
    if (!currentUser) return;

    const connectWebSocket = () => {
      console.log('Setting up real-time updates for chat list...');

      try {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(() => socket);

        client.debug = (str: string) =>
          console.log('ChatList STOMP Debug:', str);

        client.connect(
          {},
          () => {
            console.log('ChatList WebSocket Connected');
            setIsConnected(true);
            setStompClient(client);

            // Subscribe to all private room updates for this user
            // This will listen to messages from any room this user is part of
            client.subscribe(
              `/topic/chat-updates/${currentUser}`,
              (payload: StompFrame) => {
                console.log('Received chat list update:', payload.body);
                const update = JSON.parse(payload.body);
                handleChatUpdate(update);
              }
            );
          },
          (error: Error) => {
            console.error('ChatList WebSocket Connection error:', error);
            setIsConnected(false);
          }
        );
      } catch (error) {
        console.error('Failed to setup WebSocket for chat list:', error);
      }
    };

    connectWebSocket();

    // Cleanup WebSocket on unmount
    return () => {
      if (stompClient) {
        console.log('Disconnecting ChatList WebSocket...');
        stompClient.disconnect();
        setStompClient(null);
        setIsConnected(false);
      }
    };
  }, [currentUser]);

  // Handle real-time chat updates
  const handleChatUpdate = (update: any) => {
    console.log('Processing chat update:', update);

    // Refresh the conversation list when we receive updates
    // This ensures the list stays up-to-date with new messages and unread counts
    fetchUsersAndChats();
  };

  // Helper function to format relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const filteredUsers = availableUsers.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter out sponsors who already have conversations with the current user
  const conversationUsernames = new Set(
    availableUsers.map((user) => user.username)
  );
  const filteredSponsors = sponsors.filter(
    (sponsor) =>
      !conversationUsernames.has(sponsor.username) && // Exclude sponsors with existing conversations
      sponsor.username !== currentUser && // Exclude current user
      (sponsor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sponsor.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sponsor.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sponsor.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleStartNewChat = () => {
    const username = newChatUser.trim();
    if (username && username !== currentUser) {
      onSelectUser(username);
      setNewChatUser('');
      setShowAddChat(false);
    }
  };

  // Handle user selection and refresh data to move sponsors from "All Sponsors" to "Available Sponsors"
  const handleSelectUser = (username: string) => {
    onSelectUser(username);
    // Optionally switch to conversations tab when starting a new chat
    setActiveTab('conversations');
  };

  const getAvatarColor = (username: string): string => {
    const colors = [
      '#2196F3',
      '#32c787',
      '#00BCD4',
      '#ff5652',
      '#ffc107',
      '#ff85af',
      '#FF9800',
      '#39bbb0',
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = 31 * hash + username.charCodeAt(i);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                // onLogout();
                setShowChat(false);
              }}
              className="text-white hover:bg-green-700 p-1 rounded"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">Hello,</h1>
              <h2 className="text-2xl font-bold">{currentUser}</h2>
            </div>
          </div>
          <button
            onClick={() => setShowAddChat(true)}
            className="bg-green-700 hover:bg-green-800 p-2 rounded-full"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('conversations')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'conversations'
                ? 'bg-green-800 text-white'
                : 'text-green-100 hover:text-white hover:bg-green-700'
            }`}
          >
            Available Sponsors
          </button>
          <button
            onClick={() => setActiveTab('sponsors')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'sponsors'
                ? 'bg-green-800 text-white'
                : 'text-green-100 hover:text-white hover:bg-green-700'
            }`}
          >
            All Sponsors
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder={
              activeTab === 'conversations'
                ? 'Search conversations...'
                : 'Search sponsors...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">
              {activeTab === 'conversations'
                ? 'Loading conversations...'
                : 'Loading sponsors...'}
            </p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'conversations'
                ? 'Error Loading Conversations'
                : 'Error Loading Sponsors'}
            </h3>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : activeTab === 'conversations' ? (
          // Conversations Tab Content
          filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No conversations yet
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Start a new conversation to begin chatting
              </p>
              <button
                onClick={() => setShowAddChat(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Start New Chat
              </button>
            </div>
          ) : (
            filteredUsers.map((user, index) => (
              <div
                key={index}
                onClick={() => handleSelectUser(user.username)}
                className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
              >
                {/* Avatar */}
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: getAvatarColor(user.username) }}
                  >
                    {user.username[0].toUpperCase()}
                  </div>
                  {user.isOnline && (
                    <div className="absolute -bottom-0 -right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 ml-3 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium text-gray-900 truncate">
                      {user.username}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2">
                      {user.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate pr-2">
                      {user.lastMessage || 'No messages yet'}
                    </p>
                    {user.unreadCount && user.unreadCount > 0 && (
                      <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {user.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )
        ) : // Sponsors Tab Content
        filteredSponsors.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No sponsors found
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Try adjusting your search terms
            </p>
          </div>
        ) : (
          filteredSponsors.map((sponsor, index) => (
            <div
              key={index}
              onClick={() => handleSelectUser(sponsor.username)}
              className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
            >
              {/* Avatar */}
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: getAvatarColor(sponsor.username) }}
                >
                  {sponsor.fullName[0].toUpperCase()}
                </div>
                <div className="absolute -bottom-0 -right-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white">
                  <svg
                    className="w-2 h-2 text-white ml-0.5 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>

              {/* Sponsor Info */}
              <div className="flex-1 ml-3 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-gray-900 truncate">
                    {sponsor.fullName}
                  </h3>
                  <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                    Sponsor
                  </span>
                </div>
                <div className="mt-1">
                  <p className="text-sm text-gray-600 truncate pr-2">
                    {sponsor.bio}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    @{sponsor.username} • {sponsor.companyName}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="bg-white p-4 border-t border-gray-200">
        <p className="text-center text-xs text-gray-500">
          Realtime Chat Powered by Voluntrix
        </p>
      </div>

      {/* Add New Chat Modal */}
      {showAddChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Start New Chat</h3>
              <button
                onClick={() => {
                  setShowAddChat(false);
                  setNewChatUser('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label
                htmlFor="newChatUser"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter username
              </label>
              <input
                type="text"
                id="newChatUser"
                value={newChatUser}
                onChange={(e) => setNewChatUser(e.target.value)}
                placeholder="Username to chat with"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyPress={(e) => e.key === 'Enter' && handleStartNewChat()}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowAddChat(false);
                  setNewChatUser('');
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStartNewChat}
                disabled={!newChatUser.trim()}
                className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
