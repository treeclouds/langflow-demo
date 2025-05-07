import React, { useState, useEffect, useRef, useMemo } from "react";
import { Wrapper, ChatBox, Bubble, Form, Input, Button } from "./element";
import socket from "../../socket";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useParams } from "react-router-dom";

const ChatWindow = () => {
  const [input, setInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    const handleMessage = (msg) => {
      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.temp);
        return [
          ...filtered,
          { ...msg, timestamp: msg.timestamp || new Date().toISOString() },
        ];
      });
    };

    socket.on("chat-message", handleMessage);
    return () => socket.off("chat-message", handleMessage);
  }, []);

  useEffect(() => {
    socket.on("typing", ({ typing }) => setAiTyping(typing));
    return () => socket.off("typing");
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, aiTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = {
      from: "user",
      text: input,
      roomId: id,
      timestamp: new Date().toISOString(),
    };
    socket.emit("chat-message", msg);
    setInput("");
  };

  const displayMessages = useMemo(() => {
    const typingMsg = aiTyping
      ? [{ from: "ai", text: "*typing...*", temp: true }]
      : [];
    return [...messages, ...typingMsg];
  }, [messages, aiTyping]);

  const renderMessage = (msg, index) => (
    <Bubble
      key={index}
      isUser={msg.from === "user"}
      style={{ position: "relative", paddingBottom: "1.2rem" }}
    >
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "0.8rem",
                }}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {msg.text}
      </ReactMarkdown>

      {/* Only show timestamp if it's not a temp message */}
      {msg.timestamp && !msg.temp && (
        <div
          style={{
            position: "absolute",
            bottom: "4px",
            right: "8px",
            fontSize: "0.7rem",
            color: "#666",
          }}
        >
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      )}
    </Bubble>
  );

  return (
    <Wrapper>
      <ChatBox>
        {displayMessages.map(renderMessage)}
        <div ref={chatEndRef} />
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
