import { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import ChatLogin from './ChatLogin';

interface StompSubscription {
  unsubscribe: () => void;
}

interface ChatUser {
  userId: string;
  username: string;
  lastMessage?: string;
  timestamp?: string;
}

export default function ChatInterface() {
  const [stompClient, setStompClient] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentReceiverId, setCurrentReceiverId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<string>('None');
  const [typingIndicator, setTypingIndicator] = useState('');
  const [subscriptions, setSubscriptions] = useState<StompSubscription[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const establishConnection = (client: any, userId: string, userName: string) => {
    return new Promise<void>((resolve, reject) => {
      try {
        client.connect(
          {},
          // Success callback
          (frame: any) => {
            console.log('WebSocket Connected:', frame);
            resolve();
          },
          // Error callback
          (error: any) => {
            console.error('WebSocket Connection Failed:', error);
            reject(error);
          }
        );
      } catch (error) {
        console.error('WebSocket Connection Error:', error);
        reject(error);
      }
    });
  };

  const connect = async (userId?: string, userName?: string) => {
    // Use parameters if provided, otherwise use current state
    const userIdToUse = userId || currentUserId;
    const userNameToUse = userName || currentUserName;
    
    console.log('Connect called with:', { 
      providedUserId: userId, 
      providedUserName: userName,
      stateUserId: currentUserId,
      stateUserName: currentUserName,
      finalUserId: userIdToUse,
      finalUserName: userNameToUse
    });

    if (!userIdToUse.trim() || !userNameToUse.trim()) {
      console.error('Missing credentials in connect:', { userIdToUse, userNameToUse });
      alert('Please enter both User ID and Name');
      return;
    }

    try {
      // Clean up any existing connection
      if (stompClient) {
        try {
          stompClient.disconnect();
        } catch (e) {
          console.error('Error disconnecting existing client:', e);
        }
        setStompClient(null);
      }
      setIsConnected(false);
      
      console.log('Starting new connection process with credentials:', { userIdToUse, userNameToUse });
      const socket = new SockJS('http://localhost:8080/ws');
      socket.onopen = () => console.log('SockJS connection opened');
      socket.onclose = () => {
        console.log('SockJS connection closed');
        setIsConnected(false);
      };
      
      const client = Stomp.over(socket);
      client.debug = (str: string) => console.log('STOMP Debug:', str);
      
      // Configure STOMP client with shorter heartbeat
      client.heartbeat.outgoing = 10000; // 10 seconds
      client.heartbeat.incoming = 10000; // 10 seconds
      
      console.log('Initializing STOMP client...');
      
      // Set up the client first
      setStompClient(client);
      
      // Now connect with the provided credentials
      client.connect(
        {
          userId: userIdToUse,
          userName: userNameToUse
        },
        // Success callback
        (frame: any) => {
          console.log('STOMP Connection successful:', frame);
          setIsConnected(true);
          
          // Set up subscriptions with the correct user credentials
          setupSubscriptions(client, userIdToUse, userNameToUse);
          
          // Notify connection success
          console.log('Chat system fully initialized');
        },
        // Error callback
        (error: any) => {
          console.error('STOMP Connection failed:', error);
          setIsConnected(false);
          setStompClient(null);
          // Try to reconnect after 5 seconds with the same credentials
          setTimeout(() => connect(userIdToUse, userNameToUse), 5000);
        }
      );
      
    } catch (error) {
      console.error('Connection failed:', error);
      setIsConnected(false);
      setTimeout(() => connect(userIdToUse, userNameToUse), 5000);
    }
  };

  const setupSubscriptions = (client: any, userId?: string, userName?: string) => {
    // Use parameters if provided, otherwise use current state
    const userIdToUse = userId || currentUserId;
    const userNameToUse = userName || currentUserName;
    
    console.log('Setting up subscriptions for:', { userIdToUse, userNameToUse });

    const subs = [
      // Private messages subscription
      client.subscribe('/user/topic/messages', (message: any) => {
        const receivedMessage = JSON.parse(message.body);
        console.log('Received message:', receivedMessage);
        if (receivedMessage.type === 'CHAT') {
          if (receivedMessage.senderId === currentReceiverId || receivedMessage.receiverId === currentReceiverId) {
            showMessage(receivedMessage, 'received');
          }
        } else {
          showMessage(receivedMessage, 'system');
        }
      }),
      
      // Message status updates subscription
      client.subscribe('/user/topic/message-status', (message: any) => {
        const statusUpdate = JSON.parse(message.body);
        updateMessageStatus(statusUpdate);
      }),
      
      // Typing indicators subscription
      client.subscribe('/user/topic/typing', (message: any) => {
        const typingMessage = JSON.parse(message.body);
        if (typingMessage.senderId === currentReceiverId) {
          setTypingIndicator(
            typingMessage.type === 'TYPING' 
              ? `${typingMessage.senderName} is typing...`
              : ''
          );
        }
      }),
      
      // Public messages subscription
      client.subscribe('/topic/public', (message: any) => {
        const publicMessage = JSON.parse(message.body);
        showMessage(publicMessage, 'system');
      }),
      
      // User status updates subscription
      client.subscribe('/topic/user-status', (message: any) => {
        const userStatus = JSON.parse(message.body);
        updateUserStatus(userStatus);
      })
    ];

    setSubscriptions(subs);

    // Add user to chat with the correct credentials
    console.log('Sending addUser message with:', { userIdToUse, userNameToUse });
    client.send("/app/chat.addUser", {}, JSON.stringify({
      senderId: userIdToUse,
      senderName: userNameToUse,
      type: 'JOIN'
    }));

    // Load chat history
    loadChatHistory();
  };

  const disconnect = () => {
    // Unsubscribe from all subscriptions
    subscriptions.forEach(subscription => subscription.unsubscribe());
    setSubscriptions([]);
    
    if (stompClient) {
      stompClient.disconnect();
      setStompClient(null);
      setIsConnected(false);
      setMessages([]); // Clear messages on disconnect
    }
  };

  const sendMessage = () => {
    console.log('Send message attempt:', {
      isConnected,
      hasStompClient: !!stompClient,
      hasReceiver: !!currentReceiverId,
      selectedUser,
      messageInput: messageInput.trim()
    });
    
    if (messageInput.trim() && stompClient && currentReceiverId) {
      const timestamp = new Date().toISOString();
      const chatMessage = {
        senderId: currentUserId,
        senderName: currentUserName,
        receiverId: currentReceiverId,
        content: messageInput.trim(),
        type: 'CHAT',
        timestamp: timestamp,
        status: 'SENT'
      };

      try {
        console.log('Sending message:', chatMessage);
        
        // First show the message locally
        showMessage({ ...chatMessage, messageType: 'sent' }, 'sent');
        
        // Then send it through WebSocket
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        
        // Clear input
        setMessageInput('');
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
      }
    } else if (!currentReceiverId) {
      alert('Please select a user to chat with');
    }
  };

  const showMessage = (message: any, type: string) => {
    setMessages(prev => {
      // Check if message already exists
      const messageExists = prev.some(m => 
        m.timestamp === message.timestamp && 
        m.senderId === message.senderId && 
        m.content === message.content
      );
      
      if (messageExists) {
        return prev;
      }
      
      const newMessages = [...prev, { ...message, messageType: type }];
      
      // Sort messages by timestamp if available
      if (message.timestamp) {
        newMessages.sort((a, b) => {
          const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
          return timeA - timeB;
        });
      }
      
      return newMessages;
    });

    // Scroll to bottom after messages update
    setTimeout(() => {
      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      }
    }, 100);
  };

  const updateMessageStatus = (statusUpdate: any) => {
    console.log('Message status updated:', statusUpdate);
    // Implement visual status indicators here
  };

  const updateUserStatus = (userStatus: any) => {
    console.log('User status updated:', userStatus);
    loadOnlineUsers();
  };

  const loadChatHistory = async () => {
    if (!currentReceiverId || !currentUserId) return;

    try {
      console.log('Loading chat history between', currentUserId, 'and', currentReceiverId);
      const response = await fetch(
        `http://localhost:8080/api/public/chat/history?user1=${currentUserId}&user2=${currentReceiverId}`
      );
      if (!response.ok) {
        throw new Error('Failed to load chat history');
      }
      const messages = await response.json();
      console.log('Loaded messages:', messages);
      setMessages(messages.map((message: any) => ({
        ...message,
        messageType: message.senderId === currentUserId ? 'sent' : 'received'
      })));
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const loadOnlineUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/public/chat/online-users');
      const users = await response.json();
      setOnlineUsers(users.length > 0 ? users.map((user: any) => user.userName).join(', ') : 'None');
    } catch (error) {
      console.error('Error loading online users:', error);
    }
  };

  const loadChatUsers = async (userId?: string) => {
    const userIdToUse = userId || currentUserId;
    
    // Using hardcoded data for now since the backend is not ready
    const allUsers = [
      { userId: 'sanidi123', username: 'Sanidi', lastMessage: 'Hey there!', timestamp: new Date().toISOString() },
      { userId: 'harindu123', username: 'Harindu', lastMessage: 'Hello!', timestamp: new Date().toISOString() },
      { userId: 'nuraj123', username: 'Nuraj', lastMessage: 'Welcome to the chat!', timestamp: new Date().toISOString() }
    ];

    // Filter out the current user
    const filteredUsers = allUsers.filter(user => user.userId !== userIdToUse);
    console.log('Setting chat users for userId:', userIdToUse, 'filtered users:', filteredUsers);
    setChatUsers(filteredUsers);
  };

  const handleTyping = () => {
    if (currentReceiverId && stompClient) {
      stompClient.send("/app/chat.typing", {}, JSON.stringify({
        senderId: currentUserId,
        senderName: currentUserName,
        receiverId: currentReceiverId,
        type: 'TYPING'
      }));

      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }

      typingTimer.current = setTimeout(() => {
        stompClient.send("/app/chat.stopTyping", {}, JSON.stringify({
          senderId: currentUserId,
          senderName: currentUserName,
          receiverId: currentReceiverId,
          type: 'STOP_TYPING'
        }));
      }, 2000);
    }
  };

  // Effect for managing online users polling
  useEffect(() => {
    const interval = setInterval(loadOnlineUsers, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Effect for managing WebSocket connection status and cleanup
  useEffect(() => {
    if (stompClient) {
      // Add connection state listener
      const originalConnect = stompClient.connect;
      stompClient.connect = function(...args: any[]) {
        console.log('Establishing connection...');
        return originalConnect.apply(stompClient, args);
      };

      // Add disconnect listener
      const originalDisconnect = stompClient.disconnect;
      stompClient.disconnect = function(...args: any[]) {
        console.log('Disconnecting...');
        setIsConnected(false);
        return originalDisconnect.apply(stompClient, args);
      };
    }

    // Cleanup function
    return () => {
      if (stompClient) {
        disconnect();
      }
    };
  }, [stompClient]);

  // Effect for managing chat history when receiver changes
  useEffect(() => {
    if (currentReceiverId && currentUserId && isConnected) {
      loadChatHistory();
    }
  }, [currentReceiverId, currentUserId, isConnected]);

  // Effect for loading chat users
  useEffect(() => {
    if (currentUserId && isConnected) {
      loadChatUsers(currentUserId);
      // Reload chat users every 30 seconds
      const interval = setInterval(() => loadChatUsers(currentUserId), 30000);
      return () => clearInterval(interval);
    }
  }, [currentUserId, isConnected]);

  // Update chat history loading to use selected user
  useEffect(() => {
    if (selectedUser && currentUserId && isConnected) {
      setCurrentReceiverId(selectedUser.userId);
    }
  }, [selectedUser]);

  const handleLogin = async (userId: string, username: string) => {
    console.log('Login attempt with:', { userId, username });
    
    // Set state immediately
    setCurrentUserId(userId);
    setCurrentUserName(username);
    setIsLoggedIn(true);
    
    // Initialize chat users with hardcoded data for now
    const allUsers = [
      { userId: 'john123', username: 'John', lastMessage: 'Hey there!', timestamp: new Date().toISOString() },
      { userId: 'jane123', username: 'Jane', lastMessage: 'Hello!', timestamp: new Date().toISOString() },
      { userId: 'nuraj123', username: 'Nuraj', lastMessage: 'Welcome to the chat!', timestamp: new Date().toISOString() }
    ];
    
    // Filter out the current user
    const filteredUsers = allUsers.filter(user => user.userId !== userId);
    console.log('Setting chat users:', filteredUsers);
    setChatUsers(filteredUsers);
    
    // Connect to WebSocket immediately with the login credentials
    // Don't wait for state to update, pass credentials directly
    console.log('Calling connect with login credentials:', { userId, username });
    connect(userId, username);
  };

  if (!isLoggedIn) {
    return <ChatLogin onLogin={handleLogin} />;
  }

  return (
    <div className="p-5">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#029972] text-white p-4 text-center flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">Voluntrix Chat</h2>
            <div className={`ml-3 h-2 w-2 rounded-full ${isConnected ? 'bg-green-300' : 'bg-red-500'}`} 
                 title={isConnected ? 'Connected' : 'Disconnected'} />
          </div>
          <div className="text-sm">
            Logged in as: <span className="font-semibold">{currentUserName}</span>
            <button
              onClick={() => {
                disconnect();
                setIsLoggedIn(false);
                setCurrentUserId('');
                setCurrentUserName('');
                setCurrentReceiverId('');
                setMessages([]);
                setSelectedUser(null);
                setChatUsers([]);
              }}
              className="ml-4 bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex">
          {/* Chat Users Sidebar */}
          <div className="w-1/4 border-r border-gray-200">
            <div className="p-4 bg-[#e8f4f8] border-b border-gray-200">
              <strong>Chat Users</strong>
            </div>
            <div className="overflow-y-auto h-[600px]">
              {chatUsers.map((user) => (
                <div
                  key={user.userId}
                  onClick={() => {
                    console.log('Selecting user:', user);
                    // Update both states in sequence
                    setSelectedUser(user);
                    setCurrentReceiverId(user.userId);
                    console.log('Updated receiver ID to:', user.userId);
                    // Force refresh connection status
                    if (stompClient && isConnected) {
                      console.log('Connection is active');
                    } else {
                      console.log('Connection status:', { stompClient: !!stompClient, isConnected });
                    }
                  }}
                  className={`p-4 cursor-pointer hover:bg-gray-100 border-b border-gray-100 ${
                    selectedUser?.userId === user.userId ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="font-semibold">{user.username}</div>
                  {user.lastMessage && (
                    <div className="text-sm text-gray-500 truncate">
                      {user.lastMessage}
                    </div>
                  )}
                  {user.timestamp && (
                    <div className="text-xs text-gray-400">
                      {new Date(user.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="w-3/4">
            <div className="bg-[#e8f4f8] p-4 border-b border-gray-200">
              {selectedUser ? (
                <div className="font-semibold">Chatting with: {selectedUser.username}</div>
              ) : (
                <div className="text-gray-500">Select a user to start chatting</div>
              )}
            </div>

            <div
              ref={chatMessagesRef}
              className="h-[500px] overflow-y-auto p-4 bg-[#f8f9fa]"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`my-2 p-3 rounded-lg max-w-[70%] ${
                    message.messageType === 'sent'
                      ? 'ml-auto bg-[#dcf8c6] text-right'
                      : message.messageType === 'received'
                      ? 'mr-auto bg-white'
                      : 'mx-auto bg-[#fff3cd] text-center max-w-[50%] text-[#856404]'
                  }`}
                >
                  {message.type === 'JOIN' || message.type === 'LEAVE' ? (
                    `${message.senderName} ${
                      message.type === 'JOIN' ? 'joined' : 'left'
                    } the chat`
                  ) : (
                    <>
                      <strong>{message.senderName}:</strong> {message.content}
                      <div className="text-xs text-gray-500">
                        {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ''}{' '}
                        {message.status || ''}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {typingIndicator && (
              <div className="px-4 py-2 italic text-gray-600">{typingIndicator}</div>
            )}

            <div className="p-4 bg-white border-t border-gray-200 flex gap-2">
              <input
                type="text"
                placeholder={
                  !stompClient 
                    ? "Initializing chat..." 
                    : !isConnected 
                    ? "Connecting to chat server..." 
                    : !selectedUser 
                    ? "Select a user to chat with" 
                    : "Type a message..."
                }
                className={`flex-1 px-4 py-2 border rounded-full ${
                  !stompClient || !isConnected ? 'bg-gray-100' : ''
                }`}
                value={messageInput}
                onChange={(e) => {
                  console.log('Chat state:', { 
                    isConnected, 
                    hasStompClient: !!stompClient,
                    stompState: stompClient?.connected ? 'connected' : 'disconnected',
                    selectedUser, 
                    currentReceiverId 
                  });
                  setMessageInput(e.target.value);
                  if (isConnected && selectedUser) {
                    handleTyping();
                  }
                }}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={!stompClient || !isConnected || !selectedUser}
              />
              <button
                onClick={sendMessage}
                disabled={!isConnected || !selectedUser}
                className="px-6 py-2 bg-[#029972] text-white rounded-full disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}