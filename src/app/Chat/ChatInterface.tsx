import { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp, CompatClient } from '@stomp/stompjs';

interface Message {
  senderId?: string;
  senderName?: string;
  sender: string; // Keep for backward compatibility
  content: string;
  type: 'JOIN' | 'LEAVE' | 'CHAT' | 'SYSTEM';
  timestamp?: string;
}

interface HistoryMessage {
  senderName?: string;
  sender?: string;
  senderId?: string;
  content: string;
  type?: string;
  timestamp?: string;
}

interface StompFrame {
  body: string;
}

export default function ChatInterface() {
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // Add consistent userId state
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [connectionError, setConnectionError] = useState('');
  const messageAreaRef = useRef<HTMLUListElement>(null);

  // Helper function to generate consistent userId from username
  const generateUserId = (username: string): string => {
    // Create a consistent ID based on username, not timestamp
    // This ensures the same user gets the same ID when they reconnect
    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `user_${cleanUsername}`;
  };

  const colors: string[] = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
  ];

  const getAvatarColor = (messageSender: string): string => {
    let hash = 0;
    for (let i = 0; i < messageSender.length; i++) {
      hash = 31 * hash + messageSender.charCodeAt(i);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  const loadChatHistory = async (userName: string) => {
    try {
      console.log('Loading chat history for user:', userName);
      
      // Try to load user-specific history first
      const userResponse = await fetch(`http://localhost:8081/api/public/chat/user-history/${encodeURIComponent(userName)}?limit=50`);
      if (userResponse.ok) {
        const userHistory = await userResponse.json();
        if (userHistory.length > 0) {
          console.log('Loaded user-specific chat history:', userHistory);
          
          const formattedMessages = userHistory.map((msg: HistoryMessage) => ({
            sender: msg.senderName || msg.sender,
            senderName: msg.senderName,
            senderId: msg.senderId,
            content: msg.content,
            type: msg.type || 'CHAT',
            timestamp: msg.timestamp
          }));
          
          setMessages(formattedMessages);
          return;
        }
      }
      
      // Fallback to public history
      const response = await fetch('http://localhost:8081/api/public/chat/public-history?limit=50');
      if (response.ok) {
        const history = await response.json();
        console.log('Loaded public chat history:', history);
        
        // Convert backend format to frontend format
        const formattedMessages = history.map((msg: HistoryMessage) => ({
          sender: msg.senderName || msg.sender,
          senderName: msg.senderName,
          senderId: msg.senderId,
          content: msg.content,
          type: msg.type || 'CHAT',
          timestamp: msg.timestamp
        }));
        
        setMessages(formattedMessages);
      } else {
        console.warn('Failed to load chat history:', response.status);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const connect = async (event: React.FormEvent) => {
    event.preventDefault();

    const name = usernameInput.trim();
    if (name) {
      setUsername(name);
      setIsUsernameSet(true);
      setConnectionError('Connecting...');

      console.log('Attempting to connect to WebSocket at http://localhost:8081/ws');
      
      try {
        const socket = new SockJS('http://localhost:8081/ws');
        
        // Add socket event listeners for debugging
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

        // Add debug logging
        client.debug = (str: string) => console.log('STOMP Debug:', str);

        setStompClient(client);

        client.connect({}, 
          // Success callback
          async () => {
            console.log('WebSocket Connected successfully');
            setIsConnected(true);
            setConnectionError('');

            // Create a consistent userId based on username (for persistence)
            const consistentUserId = generateUserId(name);
            setUserId(consistentUserId);

            // Load chat history first using the username
            await loadChatHistory(name);

            // Subscribe to public messages
            client.subscribe('/topic/public', onMessageReceived);

            client.send(
              "/app/chat.addUser",
              {},
              JSON.stringify({ 
                senderId: consistentUserId,
                senderName: name, 
                type: 'JOIN' 
              })
            );
          },
          // Error callback
          (error: Error) => {
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

    if (messageContent && stompClient && username && userId) {
      const chatMessage = {
        senderId: userId, // Use the consistent userId instead of generating new one
        senderName: username,
        content: messageInput,
        type: 'CHAT',
        timestamp: new Date().toISOString()
      };

      console.log('Sending public message:', chatMessage);
      stompClient.send("/app/chat.sendPublicMessage", {}, JSON.stringify(chatMessage));
      setMessageInput('');
    }
  };

  const onMessageReceived = (payload: StompFrame) => {
    const message: Message = JSON.parse(payload.body);
    
    setMessages(prev => [...prev, message]);

    // Scroll to bottom after messages update
    setTimeout(() => {
      if (messageAreaRef.current) {
        messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
      }
    }, 100);
  };

  if (!isUsernameSet) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Join Private Chat
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
            
            {connectionError && (
              <div className={`p-3 rounded-md text-sm ${
                connectionError.includes('Failed') 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {connectionError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md transition-colors bg-blue-500 text-white hover:bg-blue-600"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Private Chat Session</h2>
            <div className="text-sm opacity-90">
              Connected as {username}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-300' : 'bg-red-500'}`} />
            <span className="text-sm">
              {isConnected ? 'Connected' : connectionError || 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {/* Privacy Notice */}
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-xs text-green-700">
              🔒 <strong>Private Session:</strong> Only the 2 users who participate in a conversation can see those messages. 
              If you rejoin, you&apos;ll see your previous conversations. New users who join after others leave will start fresh sessions 
              and cannot see previous conversations for privacy protection.
            </div>
          </div>
          
          <ul ref={messageAreaRef} className="space-y-3">
            {messages.map((message, index) => {
              // Handle both old and new message formats
              const displayName = message.senderName || message.sender;
              const messageType = message.type;
              
              return (
                <li key={index}>
                  {messageType === 'JOIN' || messageType === 'LEAVE' ? (
                    <div className="text-center">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                        {displayName} {messageType === 'JOIN' ? 'joined!' : 'left!'}
                      </span>
                    </div>
                  ) : messageType === 'SYSTEM' ? (
                    <div className="text-center my-4">
                      <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-xs inline-block">
                        ℹ️ {message.content}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: getAvatarColor(displayName) }}
                      >
                        {displayName[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-800">{displayName}</span>
                          {message.timestamp && (
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mt-1">{message.content}</p>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={sendMessage} className="flex space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
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
      </div>
    </div>
  );
}