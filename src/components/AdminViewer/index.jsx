import React, { useEffect, useState } from 'react';
import { Wrapper, ChatBox, Bubble, Form, Input, Button } from './element';
import socket from '../../socket'; // ✅ Make sure this path is correct

const AdminViewer = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // ✅ Listen to messages from user
    socket.on('chat-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // ✅ Clean up on unmount
    return () => {
      socket.off('chat-message');
    };
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const adminMessage = { from: 'admin', text: input };
    socket.emit('chat-message', adminMessage); // ✅ send to backend
    setMessages((prev) => [...prev, adminMessage]);
    setInput('');
  };

  return (
    <Wrapper>
      <h2>Admin Viewer</h2>
      <ChatBox>
        {messages.map((msg, index) => (
          <Bubble key={index} from={msg.from}>
            <strong>{msg.from.toUpperCase()}:</strong> {msg.text}
          </Bubble>
        ))}
      </ChatBox>
      <Form onSubmit={handleSend}>
        <Input
          type="text"
          placeholder="Reply as Admin..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </Form>
    </Wrapper>
  );
};

export default AdminViewer;
