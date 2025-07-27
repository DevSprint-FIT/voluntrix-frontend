import { useEffect, useState } from 'react';

interface ChatUser {
  username: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

interface ChatListProps {
  currentUser: string;
  onSelectUser: (otherUser: string) => void;
  onLogout: () => void;
}

export default function ChatListInterface({ currentUser, onSelectUser, onLogout }: ChatListProps) {
  const [availableUsers, setAvailableUsers] = useState<ChatUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddChat, setShowAddChat] = useState(false);
  const [newChatUser, setNewChatUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Fetch available users and recent chats from backend
  useEffect(() => {
    const fetchUsersAndChats = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      setError('');
      
      try {
        // Fetch recent conversations for the current user
        const conversationsResponse = await fetch(`http://localhost:8081/api/private-chat/conversations/${encodeURIComponent(currentUser)}`);
        
        let recentChats: ChatUser[] = [];
        if (conversationsResponse.ok) {
          const conversations = await conversationsResponse.json();
          
          // Transform conversations to ChatUser format
          recentChats = conversations.map((conv: any) => {
            const otherUser = conv.user1 === currentUser ? conv.user2 : conv.user1;
            return {
              username: otherUser,
              lastMessage: conv.lastMessage?.content || 'No messages yet',
              timestamp: conv.lastMessage?.timestamp ? formatRelativeTime(conv.lastMessage.timestamp) : '',
              unreadCount: conv.unreadCount || 0,
              isOnline: Math.random() > 0.5 // TODO: Implement real online status
            };
          });
        }
        
        // If no recent chats, show some default available users
        if (recentChats.length === 0) {
          const defaultUsers: ChatUser[] = [
            {
              username: 'Harindu Hadithya',
              lastMessage: "Available for new conversations",
              timestamp: 'Online',
              unreadCount: 0,
              isOnline: true
            },
            {
              username: 'Alice Johnson',
              lastMessage: "Ready to help with volunteering",
              timestamp: 'Online',
              unreadCount: 0,
              isOnline: true
            },
            {
              username: 'Bob Smith',
              lastMessage: "Looking for sponsors",
              timestamp: 'Online',
              unreadCount: 0,
              isOnline: true
            },
            {
              username: 'Carol White',
              lastMessage: "Community organizer",
              timestamp: 'Online',
              unreadCount: 0,
              isOnline: false
            }
          ];
          
          // Filter out current user from default users
          recentChats = defaultUsers.filter(user => user.username !== currentUser);
        }
        
        setAvailableUsers(recentChats);
      } catch (error) {
        console.error('Error fetching users and chats:', error);
        setError('Failed to load conversations');
        
        // Fallback to default users on error
        const fallbackUsers: ChatUser[] = [
          {
            username: 'Harindu Hadithya',
            lastMessage: "Available for conversations",
            timestamp: 'Online',
            unreadCount: 0,
            isOnline: true
          }
        ].filter(user => user.username !== currentUser);
        
        setAvailableUsers(fallbackUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndChats();
  }, [currentUser]);

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

  const filteredUsers = availableUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartNewChat = () => {
    const username = newChatUser.trim();
    if (username && username !== currentUser) {
      onSelectUser(username);
      setNewChatUser('');
      setShowAddChat(false);
    }
  };

  const getAvatarColor = (username: string): string => {
    const colors = [
      '#2196F3', '#32c787', '#00BCD4', '#ff5652',
      '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
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
      <div className="bg-shark-900 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button 
              onClick={onLogout}
              className="text-white hover:bg-green-700 p-1 rounded"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6">
          <button className="bg-green-800 text-white px-4 py-2 rounded-full text-sm font-medium">
            Available Sponsors
          </button>
          <button className="text-green-100 hover:text-white text-sm font-medium">
            All Sponsors
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">Loading conversations...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Conversations</h3>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-gray-500 text-sm mb-4">Start a new conversation to begin chatting</p>
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
              onClick={() => onSelectUser(user.username)}
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
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <label htmlFor="newChatUser" className="block text-sm font-medium text-gray-700 mb-2">
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
