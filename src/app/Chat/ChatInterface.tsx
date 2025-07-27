import { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  content: string;
  type: 'CHAT' | 'JOIN' | 'LEAVE';
  timestamp: string;
  status?: 'SENT' | 'DELIVERED' | 'READ';
}

interface User {
  userId: string;
  userName: string;
  handle: string;
  email: string;
  userType: string;
  isOnline: boolean;
}

interface Conversation {
  [key: string]: Message[];
}

export default function ChatInterface() {
  const [stompClient, setStompClient] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [conversations, setConversations] = useState<Conversation>({});
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [connectionError, setConnectionError] = useState('');
  const messageAreaRef = useRef<HTMLUListElement>(null);

  const colors: string[] = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
  ];

  const getAvatarColor = (name: string): string => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = 31 * hash + name.charCodeAt(i);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  const loadAllUsers = async () => {
    try {
      console.log('Loading all users...');
      const response = await fetch('http://localhost:8080/api/public/chat/all-users');
      if (response.ok) {
        const users = await response.json();
        console.log('Loaded all users:', users);
        setAllUsers(users);
      } else {
        console.warn('Failed to load users:', response.status);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadOnlineUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/public/chat/online-users');
      if (response.ok) {
        const users = await response.json();
        const onlineUserIds: Set<string> = new Set<string>(users.map((user: any) => user.userId as string));
        setOnlineUsers(onlineUserIds);
        console.log('Online users updated:', onlineUserIds);
      }
    } catch (error) {
      console.error('Error loading online users:', error);
    }
  };

  const loadChatHistory = async (user1: string, user2: string) => {
    try {
      console.log(`Loading chat history between ${user1} and ${user2}...`);
      const response = await fetch(
        `http://localhost:8080/api/public/chat/history?user1=${encodeURIComponent(user1)}&user2=${encodeURIComponent(user2)}`
      );
      if (response.ok) {
        const history = await response.json();
        console.log('Loaded chat history:', history);
        
        const conversationKey = getConversationKey(user1, user2);
        setConversations(prev => ({
          ...prev,
          [conversationKey]: history
        }));
      } else {
        console.warn('Failed to load chat history:', response.status);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const getConversationKey = (user1: string, user2: string): string => {
    return [user1, user2].sort().join('_');
  };

  const connect = (event: React.FormEvent) => {
    event.preventDefault();

    const name = usernameInput.trim();
    if (name) {
      const userId = 'user_' + Date.now();
      setCurrentUser(userId);
      setCurrentUserName(name);
      setIsUsernameSet(true);
      setConnectionError('Connecting...');

      console.log('Attempting to connect to WebSocket at http://localhost:8080/ws');
      
      try {
        const socket = new SockJS('http://localhost:8080/ws');
        
        socket.onopen = () => console.log('SockJS connection opened');
        socket.onclose = (event) => {
          console.log('SockJS connection closed:', event);
          setIsConnected(false);
          setConnectionError('Connection lost');
        };
        socket.onerror = (error) => {
          console.error('SockJS error:', error);
          setConnectionError('Connection error occurred');
        };

        const client = Stomp.over(() => socket);
        client.debug = (str: string) => console.log('STOMP Debug:', str);
        setStompClient(client);

        client.connect({}, 
          async () => {
            console.log('WebSocket Connected successfully');
            setIsConnected(true);
            setConnectionError('');

            // Load all users and online users
            await loadAllUsers();
            await loadOnlineUsers();

            // Subscribe to private messages for this user
            client.subscribe(`/user/${userId}/queue/messages`, onPrivateMessageReceived);
            
            // Subscribe to user status updates
            client.subscribe('/topic/user-status', onUserStatusUpdate);

            // Notify server that user joined
            client.send(
              "/app/chat.addUser",
              {},
              JSON.stringify({ 
                senderId: userId,
                senderName: name, 
                type: 'JOIN' 
              })
            );
          },
          (error: any) => {
            console.error('STOMP Connection error:', error);
            setConnectionError('Failed to connect to chat server');
            setIsConnected(false);
          }
        );
      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        setConnectionError('Failed to initialize connection');
      }
    }
  };

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();

    const messageContent = messageInput.trim();

    if (messageContent && stompClient && currentUser && currentUserName && selectedUser) {
      const chatMessage: Message = {
        senderId: currentUser,
        receiverId: selectedUser.userId,
        senderName: currentUserName,
        content: messageContent,
        type: 'CHAT',
        timestamp: new Date().toISOString(),
        status: 'SENT'
      };

      console.log('Sending private message:', chatMessage);
      stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
      
      // Add message to local conversation immediately
      const conversationKey = getConversationKey(currentUser, selectedUser.userId);
      setConversations(prev => ({
        ...prev,
        [conversationKey]: [...(prev[conversationKey] || []), chatMessage]
      }));
      
      setMessageInput('');
    }
  };

  const onPrivateMessageReceived = (payload: any) => {
    const message: Message = JSON.parse(payload.body);
    console.log('Private message received:', message);
    
    const conversationKey = getConversationKey(message.senderId, message.receiverId);
    setConversations(prev => ({
      ...prev,
      [conversationKey]: [...(prev[conversationKey] || []), message]
    }));

    // Scroll to bottom after message update
    setTimeout(() => {
      if (messageAreaRef.current) {
        messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
      }
    }, 100);
  };

  const onUserStatusUpdate = (payload: any) => {
    const statusUpdate = JSON.parse(payload.body);
    console.log('User status update:', statusUpdate);
    
    if (statusUpdate.type === 'USER_ONLINE') {
      setOnlineUsers(prev => new Set([...prev, statusUpdate.userId]));
    } else if (statusUpdate.type === 'USER_OFFLINE') {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(statusUpdate.userId);
        return newSet;
      });
    }
  };

  const selectUser = async (user: User) => {
    setSelectedUser(user);
    if (currentUser) {
      await loadChatHistory(currentUser, user.userId);
    }
  };

  // Update online users periodically
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        loadOnlineUsers();
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isConnected]);

  // Scroll to bottom when conversation changes
  useEffect(() => {
    setTimeout(() => {
      if (messageAreaRef.current) {
        messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
      }
    }, 100);
  }, [selectedUser, conversations]);

  if (!isUsernameSet) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Join Chat
          </h1>
          <form onSubmit={connect} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Enter your name
              </label>
              <input
                type="text"
                id="name"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your name"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  const currentConversation = selectedUser && currentUser ? 
    conversations[getConversationKey(currentUser, selectedUser.userId)] || [] : [];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex">
        {/* Users Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="bg-blue-500 text-white p-4">
            <h2 className="text-lg font-bold">Users</h2>
            <div className="flex items-center space-x-2 mt-2">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-300' : 'bg-red-500'}`} />
              <span className="text-sm">
                {isConnected ? 'Connected' : connectionError || 'Disconnected'}
              </span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {allUsers.map((user) => (
              <div
                key={user.userId}
                onClick={() => selectUser(user)}
                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedUser?.userId === user.userId ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: getAvatarColor(user.userName) }}
                    >
                      {user.userName[0].toUpperCase()}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        onlineUsers.has(user.userId) ? 'bg-shark-500' : 'bg-gray-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.userName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      @{user.handle}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {user.userType}
                    </p>
                  </div>
                  {onlineUsers.has(user.userId) && (
                    <div className="text-xs text-shark-600 font-medium">Online</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: getAvatarColor(selectedUser.userName) }}
                    >
                      {selectedUser.userName[0].toUpperCase()}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        onlineUsers.has(selectedUser.userId) ? 'bg-shark-500' : 'bg-gray-400'
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedUser.userName}</h3>
                    <p className="text-sm text-gray-500">
                      {onlineUsers.has(selectedUser.userId) ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <ul ref={messageAreaRef} className="space-y-3">
                  {currentConversation.map((message, index) => {
                    const isMyMessage = message.senderId === currentUser;
                    
                    return (
                      <li key={index} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isMyMessage 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}>
                          {!isMyMessage && (
                            <p className="text-xs text-gray-500 mb-1">{message.senderName}</p>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className={`text-xs ${isMyMessage ? 'text-blue-100' : 'text-gray-400'}`}>
                              {new Date(message.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                            {isMyMessage && message.status && (
                              <span className="text-xs text-blue-100 ml-2">
                                {message.status === 'SENT' && '✓'}
                                {message.status === 'DELIVERED' && '✓✓'}
                                {message.status === 'READ' && '✓✓'}
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={sendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder={`Message ${selectedUser.userName}...`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    disabled={!isConnected}
                  />
                  <button
                    type="submit"
                    disabled={!isConnected || !messageInput.trim()}
                    className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a user from the sidebar to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}