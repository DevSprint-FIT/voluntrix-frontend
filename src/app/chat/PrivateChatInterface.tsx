import { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp, CompatClient } from '@stomp/stompjs';

interface Message {
  senderId?: string;
  senderName?: string;
  sender: string;
  content: string;
  type: 'JOIN' | 'LEAVE' | 'CHAT' | 'SYSTEM';
  timestamp?: string;
}

interface PrivateRoom {
  roomId: string;
  user1: string;
  user2: string;
  success: boolean;
  message?: string;
}

interface StompFrame {
  body: string;
}

interface PrivateChatProps {
  initialUser: string;
  initialOtherUser: string;
  onBack: () => void;
}

export default function PrivateChatInterface({ initialUser, initialOtherUser, onBack }: PrivateChatProps) {
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const [username] = useState<string>(initialUser);
  const [otherUser] = useState<string>(initialOtherUser);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [roomError, setRoomError] = useState('');
  const [isRoomReady, setIsRoomReady] = useState(false);
  const messageAreaRef = useRef<HTMLDivElement>(null);

  // Auto-connect when component mounts
  useEffect(() => {
    if (username && otherUser) {
      connectToChat();
    }
  }, [username, otherUser]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stompClient) {
        console.log('Disconnecting STOMP client...');
        stompClient.disconnect(() => {
          console.log('STOMP client disconnected');
        });
      }
    };
  }, [stompClient]);

  // Create or get private room
  const createPrivateRoom = async (user1: string, user2: string): Promise<string | null> => {
    try {
      console.log('Creating/getting private room for:', user1, 'and', user2);
      
      const response = await fetch('http://localhost:8080/api/private-chat/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user1, user2 }),
      });

      if (response.ok) {
        const room: PrivateRoom = await response.json();
        console.log('Private room response:', room);
        
        if (room.success && room.roomId) {
          setRoomId(room.roomId);
          setRoomError('');
          return room.roomId;
        } else {
          setRoomError(room.message || 'Failed to create private room');
          return null;
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to create private room:', response.status, errorText);
        setRoomError(`Server error: ${response.status}`);
        return null;
      }
    } catch (error) {
      console.error('Network error creating private room:', error);
      setRoomError('Network error while creating room');
      return null;
    }
  };

  // Load private room chat history
  const loadPrivateRoomHistory = async (roomId: string, username: string) => {
    try {
      console.log('Loading private room history for:', roomId);
      
      const response = await fetch(`http://localhost:8080/api/private-chat/room/${roomId}/history?username=${encodeURIComponent(username)}`);
      
      if (response.ok) {
        const history = await response.json();
        console.log('Loaded private room history:', history);
        
        const formattedMessages = history.map((msg: any) => ({
          sender: msg.senderName || msg.sender,
          senderName: msg.senderName,
          senderId: msg.senderId,
          content: msg.content,
          type: msg.type || 'CHAT',
          timestamp: msg.timestamp
        }));
        
        setMessages(formattedMessages);
        
        // Mark messages as read after loading history
        try {
          await fetch(`http://localhost:8080/api/private-chat/room/${roomId}/mark-read?username=${encodeURIComponent(username)}`, {
            method: 'POST'
          });
          console.log('Marked messages as read for room:', roomId);
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      } else {
        console.warn('Failed to load private room history:', response.status);
      }
    } catch (error) {
      console.error('Error loading private room history:', error);
    }
  };

  const connectToChat = async () => {
    if (!username || !otherUser) {
      setConnectionError('Missing user information');
      return;
    }

    if (username === otherUser) {
      setConnectionError('You cannot chat with yourself');
      return;
    }

    setConnectionError('Setting up private chat...');

    try {
      // First create/get the private room
      const newRoomId = await createPrivateRoom(username, otherUser);
      if (!newRoomId) {
        setConnectionError('Failed to create private room');
        return;
      }

      // Connect to WebSocket
      console.log('Connecting to WebSocket...');
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

          // Load private room history
          await loadPrivateRoomHistory(newRoomId, username);

          // Subscribe to private room messages
          client.subscribe(`/topic/private-room/${newRoomId}`, onMessageReceived);

          // Join the private room
          client.send(
            `/app/private-room/${newRoomId}/join`,
            {},
            JSON.stringify({ 
              senderId: `user_${username}`,
              senderName: username,
              type: 'JOIN' 
            })
          );

          setIsRoomReady(true);
          console.log('Successfully joined private room:', newRoomId);
        },
        (error: Error) => {
          console.error('STOMP Connection error:', error);
          setConnectionError('Failed to connect to chat server');
          setIsConnected(false);
        }
      );
    } catch (error) {
      console.error('Failed to set up private chat:', error);
      setConnectionError('Failed to initialize private chat');
    }
  };

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();

    const messageContent = messageInput.trim();

    if (messageContent && stompClient && username && roomId) {
      // Create timestamp in LocalDateTime format (without timezone)
      const now = new Date();
      const timestamp = now.getFullYear() + '-' + 
        String(now.getMonth() + 1).padStart(2, '0') + '-' + 
        String(now.getDate()).padStart(2, '0') + 'T' + 
        String(now.getHours()).padStart(2, '0') + ':' + 
        String(now.getMinutes()).padStart(2, '0') + ':' + 
        String(now.getSeconds()).padStart(2, '0') + '.' + 
        String(now.getMilliseconds()).padStart(3, '0');

      const chatMessage = {
        senderId: `user_${username}`,
        senderName: username,
        content: messageInput,
        type: 'CHAT',
        timestamp: timestamp
      };

      console.log('Sending private message to room:', roomId);
      stompClient.send(`/app/private-room/${roomId}/send`, {}, JSON.stringify(chatMessage));
      setMessageInput('');
    }
  };

  const onMessageReceived = (payload: StompFrame) => {
    const message: Message = JSON.parse(payload.body);
    console.log('Received private message:', message);
    
    setMessages(prev => [...prev, message]);

    // Scroll to bottom after messages update
    setTimeout(() => {
      if (messageAreaRef.current) {
        messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
      }
    }, 100);
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

  const formatTime = (timestamp?: string): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto border-x border-gray-200 fixed inset-0 z-50"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="bg-shark-950 text-white p-4 flex items-center space-x-3 shadow-sm">
        <button
          onClick={onBack}
          className="text-shark-950 hover:bg-green-700 p-1 rounded"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-shark-950 font-bold"
          style={{ backgroundColor: getAvatarColor(otherUser) }}
        >
          {otherUser[0]?.toUpperCase()}
        </div>
        
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{otherUser}</h2>
          <p className="text-sm text-shark-200">
            {isConnected && isRoomReady ? 'Online' : 'Connecting...'}
          </p>
        </div>
      </div>

      {/* Connection Status */}
      {connectionError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-sm">
          {connectionError}
        </div>
      )}

      {roomError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-sm">
          {roomError}
        </div>
      )}

      {/* Messages Area */}
      <div 
        ref={messageAreaRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 overscroll-contain"
        onWheel={(e) => {
          // Prevent parent scroll when reaching scroll boundaries
          const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
          const isAtTop = scrollTop === 0;
          const isAtBottom = scrollTop + clientHeight >= scrollHeight;
          
          if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
            e.preventDefault();
          }
          e.stopPropagation();
        }}
      >
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.sender === username || message.senderName === username;
            
            if (message.type === 'SYSTEM' || message.type === 'JOIN' || message.type === 'LEAVE') {
              return (
                <div key={index} className="flex justify-center">
                  <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
                    {message.content}
                  </span>
                </div>
              );
            }

            return (
              <div key={index} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  isOwnMessage 
                    ? 'bg-shark-900 text-white rounded-br-sm' 
                    : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-shark-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white p-3 border-t border-gray-200">
        <form onSubmit={sendMessage} className="flex items-center space-x-2">
          <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Write your message here"
              className="flex-1 bg-transparent outline-none text-sm"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              disabled={!isConnected || !isRoomReady}
            />
          </div>
          <button
            type="submit"
            disabled={!isConnected || !isRoomReady || !messageInput.trim()}
            className="bg-shark-500 hover:bg-shark-600 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
