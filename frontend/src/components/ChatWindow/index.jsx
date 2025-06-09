import React, { useState, useEffect, useRef, useMemo } from "react";
import { Wrapper, ChatBox, Bubble, Form, Input, Button } from "./element";
import socket from "../../socket";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useParams } from "react-router-dom";
import { SpinnerRoundFilled } from "spinners-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";

async function getAIResponse(userText) {
  try {
    const res = await fetch(process.env.REACT_APP_URL, {
      method: "POST",
      headers: {
        "x-api-key": process.env.REACT_APP_LANGFLOW_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input_value: userText,
        output_type: "chat",
        input_type: "chat",
        tweaks: {
          "File-o3QkD": {},
          "ParseData-yY0Ub": {},
          "Prompt-1eccd": {},
          "ChatInput-L83nO": {},
          "OpenAIModel-ppjvf": {},
          "ChatOutput-IwChK": {},
        },
      }),
    });

    const data = await res.json();
    const responseText =
      data?.outputs?.[0]?.outputs?.[0]?.artifacts?.message ||
      data?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message ||
      "No output.";
    return new Promise((resolve) =>
      setTimeout(() => resolve(responseText), 300)
    );
  } catch (error) {
    console.log("Upload failed:", error);
    return "AI is currently unavailable. Please try again later.";
  }
}

const ChatWindow = () => {
  const [input, setInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);
  const { id } = useParams();

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(
    "Welcome to the Virtual Assistant! How can I help you?"
  );
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support SpeechRecognition");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;
  }, []);

  const handleSpeakClick = () => {
    if (!recognitionRef.current) return;

    // 1. Stop AI speech if it's still talking
    speechSynthesis.cancel();

    // 2. Optional: Reset status
    setStatus("Listening...");

    // 3. Setup result handler
    recognitionRef.current.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("User said:", transcript);
      setStatus(transcript);

      // 4. Get AI reply
      const aiReply = await getAIResponse(transcript);
      setStatus(aiReply);

      // 5. Speak AI reply
      const utterance = new SpeechSynthesisUtterance(aiReply);
      utterance.lang = "en-US";

      // Reset status when speech ends
      utterance.onend = () => {
        setStatus("Click 'Speak' and talk.");
      };

      speechSynthesis.speak(utterance);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setStatus("Error: " + event.error);
    };

    // 6. Start listening
    recognitionRef.current.start();
  };

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
      ? [{ from: "ai", text: "*Waiting for respond*", temp: true }]
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
  );

  return (
    <Wrapper>
      <ChatBox>
        {displayMessages.map(renderMessage)}
        <div ref={chatEndRef} />
      </ChatBox>

      <IconButton
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          backgroundColor: "#1976d2",
          color: "white",
        }}
      >
        <MicIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>🎙️ Virtual Assistant</DialogTitle>
        <DialogContent style={{ textAlign: "center", paddingTop: "1.5rem" }}>
          {status === "Listening..." && (
            <div className="mic-pulse-container">
              <div className="mic-pulse" />
              <MicIcon style={{ fontSize: 48, color: "#1976d2", zIndex: 2 }} />
            </div>
          )}
          <Typography
            variant="body1"
            gutterBottom
            style={{ marginTop: "1rem" }}
          >
            {status}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSpeakClick}
            variant="contained"
            color="primary"
          >
            Click to talk
          </Button>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={aiTyping}
        />
        <Button type="submit" disabled={aiTyping}>
          {aiTyping ? <SpinnerRoundFilled size={20} color="#ffffff" /> : "Send"}
        </Button>
      </Form>
    </Wrapper>
  );
};

export default ChatWindow;
