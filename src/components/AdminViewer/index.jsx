import React, { useEffect, useState, useRef } from "react";
import socket from "../../socket";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Switch from "react-switch";

import {
  Layout,
  Sidebar,
  RoomItem,
  MainContent,
  ChatBox,
  Bubble,
  Form,
  Input,
  Button,
} from "./element";

const AdminViewer = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isInterrupting, setIsInterrupting] = useState(false);
  const [emotion, setEmotion] = useState("");
  const [rooms, setRooms] = useState([]); // 🆕 Available rooms
  const [selectedRoom, setSelectedRoom] = useState(""); // 🆕 Selected room
  const chatEndRef = useRef(null);
  const [prevRoom, setPrevRoom] = useState(null);
  // 🆕 Request room list on mount
  useEffect(() => {
    socket.on("room-list", (roomList) => {
      setRooms(roomList);
    });

    socket.emit("get-rooms"); // ask for initial list

    return () => {
      socket.off("room-list");
    };
  }, []);
  // Join selected room and listen for chat messages
  useEffect(() => {
    if (!selectedRoom) return;

    if (prevRoom !== selectedRoom) {
      setMessages([]); // Clear messages only when switching rooms
      setPrevRoom(selectedRoom); // Update the previous room to the new one
    }

    socket.emit("join-room", selectedRoom); // Join the room

    const handleMessage = (msg) => {
      // Check if the message is from the currently selected room
      if (msg.roomId === selectedRoom) {
        const withTimestamp = {
          ...msg,
          timestamp: msg.timestamp || new Date().toISOString(),
        };
        if (msg.from === "ai" && msg.emotion) {
          setEmotion(msg.emotion);
        }
        setMessages((prev) => [...prev, withTimestamp]);
      }
    };

    const handleHistory = (history) => {
      // Filter history messages by the current room
      const filteredHistory = history.filter(
        (msg) => msg.roomId === selectedRoom
      );
      const normalized = filteredHistory.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp || new Date().toISOString(),
      }));
      setMessages(normalized);
    };

    socket.on("chat-message", handleMessage);
    socket.on("chat-history", handleHistory); // ✅ history listener

    return () => {
      socket.off("chat-message", handleMessage);
      socket.off("chat-history", handleHistory); // ✅ cleanup
    };
  }, [selectedRoom, prevRoom]); // Add prevRoom to dependency array

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedRoom) return;

    const msg = {
      from: "admin",
      text: input,
      timestamp: new Date().toISOString(),
      roomId: selectedRoom, // 🆕 Send to correct room
    };

    socket.emit("chat-message", msg);
    setInput("");
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    if (!isInterrupting) {
      setIsInterrupting(true);
      socket.emit("admin-interrupt-toggle", {
        isInterrupting: true,
      });
    }
  };

  const handleInterruptToggle = () => {
    const newState = !isInterrupting;
    setIsInterrupting(newState);
    socket.emit("admin-interrupt-toggle", {
      isInterrupting: newState,
    });
  };

  const getEmotionEmoji = (emotion) => {
    switch (emotion.toLowerCase()) {
      case "happy":
        return "😊";
      case "sad":
        return "😢";
      case "angry":
        return "😡";
      case "frustrated":
        return "😤";
      case "excited":
        return "🤩";
      case "anxious":
        return "😰";
      case "neutral":
        return "😐";
      case "confuse":
        return "😕";
      default:
        return "🤔";
    }
  };

  return (
    <Layout>
      {/* Sidebar Room List */}
      <Sidebar>
        <h3>Rooms</h3>
        {rooms.length === 0 ? (
          <p>No rooms</p>
        ) : (
          rooms.map((room) => (
            <RoomItem
              key={room}
              active={room === selectedRoom}
              onClick={() => {
                setMessages([]);
                setSelectedRoom(room);
              }}
            >
              {room}
            </RoomItem>
          ))
        )}
      </Sidebar>

      {/* Main Chat Area */}
      <MainContent>
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
          <div ref={chatEndRef} />
        </ChatBox>
        <span style={{ marginLeft: "10px", fontSize: "1rem", color: "#888" }}>
          User's Emotion: {emotion || "Unknown"} {getEmotionEmoji(emotion)}
        </span>
        <Form onSubmit={handleSend}>
          <Input
            type="text"
            placeholder="Reply as Admin..."
            value={input}
            onChange={handleInputChange}
            disabled={!selectedRoom}
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
          <Button type="submit" disabled={!selectedRoom}>
            Send
          </Button>
        </Form>
      </MainContent>
    </Layout>
  );
};

export default AdminViewer;
