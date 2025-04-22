import React, { useState, useEffect } from 'react';
import { Wrapper, ChatBox, Bubble, Form, Input, Button } from './element';
import socket from '../../socket'; // adjust the path if needed

const ChatWindow = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  // Listen for incoming messages from socket
  useEffect(() => {
    socket.on('chat-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chat-message');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const msg = { from: 'user', text: input };
    setMessages((prev) => [...prev, msg]); // display it immediately
    socket.emit('chat-message', msg); // send to server
    console.log("socket", socket)
    setInput('');
  };

  return (
    <Wrapper>
      <ChatBox>
        {messages.map((msg, index) => (
          <Bubble key={index} isUser={msg.from === 'user'}>
            {msg.text}
          </Bubble>
        ))}
      </ChatBox>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <Button type="submit">Send</Button>
      </Form>
    </Wrapper>
  );
};

export default ChatWindow;
