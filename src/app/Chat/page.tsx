"use client"
import { Button } from '@heroui/react';
import React, { useState, useEffect } from 'react';

interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp?: string; 
}

const Chat: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [status, setStatus] = useState('');

  const baseUrl = 'http://localhost:8080/api/public/messages';

  const sendMessage = async () => {
    if (!content.trim()) return; //trim - removing spaces in the front and the back

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ //stringify - java script objects cannot be send so converting to JSON
          senderId: loggedInUser,
          receiverId,
          content,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setStatus('Message sent!');
      setTimeout(() => setStatus(''), 3000); 
      setContent('');
      getMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('Failed to send message');
    }
  };

  const getMessages = async () => {
    try {
      const response = await fetch(`${baseUrl}?user1=${loggedInUser}&user2=${receiverId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');

      const data: Message[] = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => { 

    let interval: ReturnType<typeof setInterval>;

    if (loggedInUser && receiverId) {
        interval = setInterval(() => {

                getMessages();
        }, 3000);
      
    }

    return () => clearInterval(interval);

  }, [loggedInUser, receiverId]);

  if (!isLoggedIn) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Login to Voluntrix Chat</h2>
        <input
          placeholder="Enter your User ID"
          value={loggedInUser}
          onChange={e => setLoggedInUser(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full mb-4"
        />
        <Button onPress={() => setIsLoggedIn(true)} className="w-full shadow-sm">
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Voluntrix Chat</h2>

      <div className="mb-4">
        <p className="mb-2">
          Logged in as: <strong>{loggedInUser}</strong>
        </p>

        <label className="block mb-1">Receiver ID:</label>
        <input
          value={receiverId}
          onChange={e => setReceiverId(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full mb-3"
        />

        <label className="block mb-1">Message:</label>
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full mb-3"
        />

        <Button onPress={sendMessage} className="w-full shadow-sm mb-2">Send</Button>
        <Button onPress={getMessages} className="w-full shadow-sm mb-4">Load Chat</Button>

        {status && <p className="text-green-600 text-sm">{status}</p>}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Chat History</h3>
        <ul className="space-y-2">
          {messages.map((msg, index) => (
            <li key={index} className="bg-gray-100 p-2 rounded shadow-sm">
              <span className="font-medium">{msg.senderId}</span> ➡ <span>{msg.receiverId}</span>: {msg.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chat;
