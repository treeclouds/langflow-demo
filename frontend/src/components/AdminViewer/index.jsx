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
  RightPanel,
  EmotionStatus,
  SwitchWrapper,
} from "./element";
import RoomSummary from "./summary";

const AdminViewer = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [rooms, setRooms] = useState([]); // 🆕 Available rooms
  const [selectedRoom, setSelectedRoom] = useState(""); // 🆕 Selected room
  const [interruptState, setInterruptState] = useState({}); // 🆕 Track interrupt state per room
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

    if (!interruptState[selectedRoom]) {
      const updatedState = { ...interruptState, [selectedRoom]: true };
      setInterruptState(updatedState);
      socket.emit("admin-interrupt-toggle", {
        roomId: selectedRoom,
        isInterrupting: true,
      });
    }
  };

  const handleInterruptToggle = () => {
    const newState = !interruptState[selectedRoom];
    const updatedState = { ...interruptState, [selectedRoom]: newState };
    setInterruptState(updatedState);

    socket.emit("admin-interrupt-toggle", {
      roomId: selectedRoom,
      isInterrupting: newState,
    });
  };

  const getEmotionEmoji = (emotion) => {
    switch (emotion?.toLowerCase()) {
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

  const latestAiMessage = messages
    ?.filter((message) => message.from === "ai" && message.emotion) // Filter AI messages with emotion
    ?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  const latestEmotion = latestAiMessage?.emotion || "No emotion found";

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
                setMessages([]); // Clear messages when changing rooms
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
                    bottom: "-1.1rem",
                    right: "0.5rem",
                    fontSize: "0.7rem",
                    color: "#999",
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

        <Form onSubmit={handleSend}>
          <Input
            type="text"
            placeholder="Reply as Admin..."
            value={input}
            onChange={handleInputChange}
            disabled={!selectedRoom}
          />
          <SwitchWrapper>
            <Switch
              checked={interruptState[selectedRoom] || false}
              onChange={handleInterruptToggle}
              offColor="#888"
              onColor="#0a0"
              uncheckedIcon={false}
              checkedIcon={false}
            />
          </SwitchWrapper>
          <Button type="submit" disabled={!selectedRoom}>
            Send
          </Button>
        </Form>
      </MainContent>

      <RightPanel>
        <RoomSummary roomId={selectedRoom} />
        <EmotionStatus>
          <span style={{ fontWeight: 500 }}>User Emotion:</span>
          <span>{latestEmotion}</span>
          <span>{getEmotionEmoji(latestEmotion)}</span>
        </EmotionStatus>
      </RightPanel>
    </Layout>
  );
};

export default AdminViewer;
