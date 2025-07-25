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

export default function PrivateChatInterface() {
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<string>('');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [otherUserInput, setOtherUserInput] = useState('');
  const [connectionError, setConnectionError] = useState('');
  const [roomError, setRoomError] = useState('');
  const [isRoomReady, setIsRoomReady] = useState(false);
  const messageAreaRef = useRef<HTMLUListElement>(null);

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

  // Create or get private room
  const createPrivateRoom = async (user1: string, user2: string) => {
    try {
      setRoomError('Creating private room...');
      
      const response = await fetch('http://localhost:8081/api/private-chat/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user1: user1,
          user2: user2
        })
      });

      if (response.ok) {
        const roomData: PrivateRoom = await response.json();
        if (roomData.success) {
          console.log('Private room created:', roomData.roomId);
          setRoomId(roomData.roomId);
          setRoomError('');
          return roomData.roomId;
        } else {
          setRoomError(roomData.message || 'Failed to create room');
          return null;
        }
      } else {
        setRoomError('Failed to create private room');
        return null;
      }
    } catch (error) {
      console.error('Error creating private room:', error);
      setRoomError('Network error while creating room');
      return null;
    }
  };

  // Load private room chat history
  const loadPrivateRoomHistory = async (roomId: string, username: string) => {
    try {
      console.log('Loading private room history for:', roomId);
      
      const response = await fetch(`http://localhost:8081/api/private-chat/room/${roomId}/history?username=${encodeURIComponent(username)}`);
      
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
      } else {
        console.warn('Failed to load private room history:', response.status);
      }
    } catch (error) {
      console.error('Error loading private room history:', error);
    }
  };

  const connect = async (event: React.FormEvent) => {
    event.preventDefault();

    const myUsername = usernameInput.trim();
    const targetUser = otherUserInput.trim();
    
    if (!myUsername || !targetUser) {
      setConnectionError('Please enter both usernames');
      return;
    }

    if (myUsername === targetUser) {
      setConnectionError('You cannot chat with yourself');
      return;
    }

    setUsername(myUsername);
    setOtherUser(targetUser);
    setIsUsernameSet(true);
    setConnectionError('Setting up private chat...');

    try {
      // First create/get the private room
      const newRoomId = await createPrivateRoom(myUsername, targetUser);
      if (!newRoomId) {
        setConnectionError('Failed to create private room');
        return;
      }

      // Connect to WebSocket
      console.log('Connecting to WebSocket...');
      const socket = new SockJS('http://localhost:8081/ws');
      
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
          await loadPrivateRoomHistory(newRoomId, myUsername);

          // Subscribe to private room messages
          client.subscribe(`/topic/private-room/${newRoomId}`, onMessageReceived);

          // Join the private room
          client.send(
            `/app/private-room/${newRoomId}/join`,
            {},
            JSON.stringify({ 
              senderId: `user_${myUsername}`,
              senderName: myUsername,
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
      const chatMessage = {
        senderId: `user_${username}`,
        senderName: username,
        content: messageInput,
        type: 'CHAT',
        timestamp: new Date().toISOString()
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

  if (!isUsernameSet) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            🔒 Start Private Chat
          </h1>
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">How it works:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Only you and the other person can see your messages</li>
              <li>• Chat history is preserved when you reconnect</li>
              <li>• No one else can join your private conversation</li>
            </ul>
          </div>
          
          <form onSubmit={connect} className="space-y-4">
            <div>
              <label htmlFor="myName" className="block text-sm font-medium text-gray-700 mb-1">
                Your name
              </label>
              <input
                type="text"
                id="myName"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label htmlFor="otherName" className="block text-sm font-medium text-gray-700 mb-1">
                Person you want to chat with
              </label>
              <input
                type="text"
                id="otherName"
                value={otherUserInput}
                onChange={(e) => setOtherUserInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter their name"
                required
              />
            </div>
            
            {(connectionError || roomError) && (
              <div className={`p-3 rounded-md text-sm ${
                connectionError.includes('Failed') || roomError.includes('Failed')
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {connectionError || roomError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md transition-colors bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
              disabled={!usernameInput.trim() || !otherUserInput.trim()}
            >
              Start Private Chat
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
            <h2 className="text-xl font-bold">🔒 Private Chat</h2>
            <div className="text-sm opacity-90">
              {username} ↔ {otherUser}
            </div>
            {roomId && (
              <div className="text-xs opacity-75">
                Room: {roomId}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-300' : 'bg-red-500'}`} />
            <span className="text-sm">
              {isConnected ? (isRoomReady ? 'Ready' : 'Connecting...') : connectionError || 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {/* Privacy Notice */}
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-xs text-green-700">
              🔒 <strong>Private Conversation:</strong> Only you and {otherUser} can see these messages. 
              This is a secure 1-on-1 conversation. No third parties can join or view your chat history.
            </div>
          </div>

          {messages.length === 0 && isRoomReady && (
            <div className="text-center py-8">
              <p className="text-gray-500">Start your private conversation with {otherUser}</p>
            </div>
          )}
          
          <ul ref={messageAreaRef} className="space-y-3">
            {messages.map((message, index) => {
              const displayName = message.senderName || message.sender;
              const messageType = message.type;
              const isMyMessage = displayName === username;
              
              return (
                <li key={index}>
                  {messageType === 'JOIN' || messageType === 'LEAVE' ? (
                    <div className="text-center">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                        {displayName} {messageType === 'JOIN' ? 'joined the private chat' : 'left the chat'}
                      </span>
                    </div>
                  ) : messageType === 'SYSTEM' ? (
                    <div className="text-center my-4">
                      <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-xs inline-block">
                        ℹ️ {message.content}
                      </span>
                    </div>
                  ) : (
                    <div className={`flex items-start space-x-3 ${isMyMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: getAvatarColor(displayName) }}
                      >
                        {displayName[0].toUpperCase()}
                      </div>
                      <div className={`flex-1 ${isMyMessage ? 'text-right' : ''}`}>
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold ${isMyMessage ? 'text-blue-800' : 'text-gray-800'}`}>
                            {isMyMessage ? 'You' : displayName}
                          </span>
                          {message.timestamp && (
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                        <div className={`mt-1 p-3 rounded-lg inline-block max-w-xs ${
                          isMyMessage 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white border border-gray-200 text-gray-700'
                        }`}>
                          {message.content}
                        </div>
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
              placeholder={`Send a private message to ${otherUser}...`}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              disabled={!isConnected || !isRoomReady}
            />
            <button
              type="submit"
              disabled={!isConnected || !isRoomReady || !messageInput.trim()}
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
