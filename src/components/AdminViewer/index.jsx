import React, { useEffect, useState, useRef } from "react";
import { Wrapper, ChatBox, Bubble, Form, Input, Button } from "./element";
import socket from "../../socket";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Switch from "react-switch";

const AdminViewer = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isInterrupting, setIsInterrupting] = useState(false);
  const chatEndRef = useRef(null); // 👈 Create a ref to scroll to

  // Listen for incoming messages
  useEffect(() => {
    socket.on("chat-message", (msg) => {
      // If no timestamp, generate one now
      const withTimestamp = {
        ...msg,
        timestamp: msg.timestamp || new Date().toISOString(),
      };

      setMessages((prev) => [...prev, withTimestamp]);
    });

    return () => {
      socket.off("chat-message");
    };
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle sending admin messages
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Send admin's message immediately when interrupting
    const msg = {
      from: "admin",
      text: input,
      timestamp: new Date().toISOString(), // 👈 add timestamp
    };

    socket.emit("chat-message", msg);
    setInput(""); // Clear input field

    // If interrupt is on, stop the AI from responding
    if (isInterrupting) {
      console.log("Admin interrupting, AI response is disabled.");
      return;
    }

    // If interrupt is off, let AI respond
    socket.emit("ai-response", { text: input });
  };

  // Handle input changes (turn on interrupt when typing)
  const handleInputChange = (e) => {
    setInput(e.target.value);

    if (!isInterrupting) {
      setIsInterrupting(true); // Enable interrupt when admin starts typing

      // Send an empty message to the server to interrupt any AI response
      const msg = {
        from: "admin",
        text: "Let me check on that wait a  moment..",
        timestamp: new Date().toISOString(),
      };

      socket.emit("chat-message", msg); // Send empty message to server
    }
  };

  // Handle interrupt toggle
  const handleInterruptToggle = () => {
    setIsInterrupting((prev) => !prev); // Toggle the interrupt state
  };

  return (
    <Wrapper>
      <h2>Admin Viewer</h2>
      <ChatBox>
        {messages.map((msg, index) => (
          <Bubble
            key={index}
            from={msg.from}
            style={{ position: "relative", paddingBottom: "1.2rem" }}
          >
            <strong>{msg.from.toUpperCase()}</strong>

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
                        marginTop: "4px",
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

            {msg.timestamp && (
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
        ))}
        <div ref={chatEndRef} /> {/* 👈 Invisible div at the bottom */}
      </ChatBox>
      <Form onSubmit={handleSend}>
        <Input
          type="text"
          placeholder="Reply as Admin..."
          value={input}
          onChange={handleInputChange} // Use the new handleInputChange function
        />
        <div>
          <Switch
            checked={isInterrupting}
            onChange={handleInterruptToggle}
            offColor="#888"
            onColor="#0a0"
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </div>
        <Button type="submit">Send</Button>
      </Form>
    </Wrapper>
  );
};

export default AdminViewer;
