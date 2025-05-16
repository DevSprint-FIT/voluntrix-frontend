"use client"
import { Button } from '@heroui/react';
import React, { useState } from 'react';

interface Message {
  senderId: string;
  receiverId: string;
  content: string;
}

const Chat: React.FC = () => {
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const baseUrl = 'http://localhost:8080/api/public/messages';

  const sendMessage = async () => {
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId, receiverId, content }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      alert('Message sent!');
      setContent('');
      getMessages(); 
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getMessages = async () => {
    try {
      const response = await fetch(`${baseUrl}?user1=${senderId}&user2=${receiverId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');

      const data: Message[] = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Voluntrix Chat</h2><br></br>

      <div>
        <label>Sender ID:</label><br />
        <input value={senderId} onChange={e => setSenderId(e.target.value)} 
        className='border border-verdant-400'/><br /><br />

        <label>Receiver ID:</label><br />
        <input value={receiverId} onChange={e => setReceiverId(e.target.value)} 
        className='border border-verdant-400'/><br /><br />

        <label>Message:</label><br />
        <input value={content} onChange={e => setContent(e.target.value)}
        className='border border-verdant-400' /><br></br><br></br>
        <Button onPress={sendMessage} className='shadow-sm'>Send</Button><br /><br />

        <Button onPress={getMessages} className='shadow-sm'>Load Chat</Button><br /><br />
      </div>

      <div>
        <h3>Chat History</h3>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              [{msg.senderId} ➡ {msg.receiverId}] {msg.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chat;
